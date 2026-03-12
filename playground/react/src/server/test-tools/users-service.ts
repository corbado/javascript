import type { PreconditionType } from '../../tools/types';
import {
  addEmailIdentifier,
  createActiveUser,
  deleteUser,
  listCredentials,
  listUsersByIDs,
  passkeyAppendStart,
  passkeyAppendFinish,
} from './bapi';
import { OidcDb } from './oidc-db';

function randomEmail() {
  const randomness = Math.floor(Math.random() * 900000) + 100000;
  return `integration-test+${randomness}@corbado.com`;
}

function randomName() {
  const names = ['Token User', 'Passkey User', 'Observe User', 'Integration User'];
  return names[Math.floor(Math.random() * names.length)];
}

export async function startPasskeyForUser(userID: string, email: string) {
  // processID should be string of length 20
  const processID = crypto.randomUUID().slice(0, 20);
  const trackingID = crypto.randomUUID();

  const start = await passkeyAppendStart(userID, email, processID);
  if (!start.appendAllow) {
    throw new Error('Passkey append is not allowed');
  }

  return {
    processID,
    trackingID,
    attestationOptions: start.attestationOptions,
  };
}

export async function finishPasskeyForUser(
  userID: string,
  processID: string,
  trackingID: string,
  attestationResponse: string,
) {
  await passkeyAppendFinish(userID, processID, trackingID, attestationResponse);
}

export async function createUserWithPrecondition(sessionId: string, precondition: PreconditionType) {
  const email = randomEmail();
  const fullName = randomName();
  const user = await createActiveUser(fullName);
  await addEmailIdentifier(user.userID, email, precondition === 'unconfirmed_user_without_pk' ? 'primary' : 'verified');

  if (
    precondition === 'confirmed_user_with_social_google_ok' ||
    precondition === 'confirmed_user_with_social_google_cancel' ||
    precondition === 'confirmed_user_with_social_google_back'
  ) {
    const mockUser = OidcDb.setSingleUser(sessionId, email);
    if (precondition === 'confirmed_user_with_social_google_cancel') {
      OidcDb.updateBehavior(mockUser.id, 'cancel');
    } else if (precondition === 'confirmed_user_with_social_google_back') {
      OidcDb.updateBehavior(mockUser.id, 'navigate_back');
    } else {
      OidcDb.updateBehavior(mockUser.id, 'success');
    }
  }

  OidcDb.addSessionUser(sessionId, user.userID);
  return user.userID;
}

export async function listSessionUsers(sessionId: string) {
  const userIDs = OidcDb.listSessionUsers(sessionId);
  const users = await listUsersByIDs(userIDs);

  return Promise.all(
    users.map(async user => {
      const credentials = await listCredentials(user.userID);
      const email = user.emailIdentifiers?.[0]?.value || '';

      return {
        userID: user.userID,
        email,
        status: user.status,
        credentials: credentials.map(credential => ({
          id: credential.id,
          credentialID: credential.credentialID,
          aaguid: credential.aaguid,
          status: credential.status,
        })),
      };
    }),
  );
}

export async function removeUser(sessionId: string, userID: string) {
  await deleteUser(userID);
  OidcDb.removeSessionUser(sessionId, userID);
}
