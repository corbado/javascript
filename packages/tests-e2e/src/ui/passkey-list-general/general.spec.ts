import { IdentifierEnforceVerification, IdentifierType, IdentifierVerification } from '../../utils/constants';
import { createProjectNew, deleteProjectNew, makeIdentifier, setComponentConfig } from '../../utils/developerpanel';
import { passkeyListTest } from '../../fixtures/PasskeyList';

passkeyListTest.describe('passkey list - general', () => {
  let projectId: string;

  passkeyListTest.beforeAll(async () => {
    projectId = await createProjectNew();

    await setComponentConfig(projectId, [
      makeIdentifier(IdentifierType.Email, IdentifierEnforceVerification.Signup, true, [
        IdentifierVerification.EmailOtp,
      ]),
    ]);
  });

  passkeyListTest.afterAll(async () => {
    await deleteProjectNew(projectId);
  });

  passkeyListTest('passkey list allows adding and deleting passkeys (passkeys are supported)', async ({ model }) => {
    await model.load(projectId, true);

    await model.expectPasskeys(0);
    await model.appendNewPasskey(true);
    await model.expectPasskeys(1);
    await model.deletePasskey(0);
    await model.expectPasskeys(0);
  });

  // currently it seems impossible to test for duplicate passkeys with virtual authenticator
  passkeyListTest('passkey list error handling (cancel, duplicate passkeys)', async ({ model }) => {
    await model.load(projectId, true);

    await model.expectPasskeys(0);
    await model.appendNewPasskey(false);
    // currently, we don't show an error message here
    await model.expectPasskeys(0);

    await model.appendNewPasskey(true);
    await model.expectPasskeys(1);
  });
});
