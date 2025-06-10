import type { ChildProcess } from 'node:child_process';

import { test } from '../../fixtures/CorbadoAuth';
import { SignupInitBlockModel } from '../../models/corbado-auth-blocks/SignupInitBlockModel';
import { IdentifierEnforceVerification, IdentifierType, ScreenNames } from '../../utils/constants';
import { createProjectNew, deleteProjectNew, makeIdentifier, setComponentConfig } from '../../utils/developerpanel';
import { killPlaygroundNew, spawnPlaygroundNew } from '../../utils/playground';

test.describe('tests that focus on these identifiers: username', () => {
  let projectId: string;
  let server: ChildProcess;
  let port: number;

  test.beforeAll(async () => {
    projectId = await createProjectNew();

    await setComponentConfig(projectId, [
      makeIdentifier(IdentifierType.Username, IdentifierEnforceVerification.None, true, []),
    ]);

    ({ server, port } = await spawnPlaygroundNew(projectId));
  });

  test.afterAll(async () => {
    await deleteProjectNew(projectId);

    killPlaygroundNew(server);
  });

  test('signup with passkey (happy path)', async ({ model }) => {
    await model.load(projectId, port, true, 'signup-init');

    const identifier = SignupInitBlockModel.generateRandomUsername();
    await model.signupInit.fillUsername(identifier);
    await model.signupInit.submitPrimary();
    await model.passkeyAppend.startPasskeyOperation(true);

    await model.expectScreen(ScreenNames.End);
    await model.logout();
    await model.expectScreen(ScreenNames.InitLogin);

    await model.passkeyVerify.performAutomaticPasskeyVerification(() => model.loginInit.submitPasskeyButton());
    await model.expectScreen(ScreenNames.End);
  });

  test('signup with passkey (one passkey retry)', async ({ model }) => {
    await model.load(projectId, port, true, 'signup-init');

    const identifier = SignupInitBlockModel.generateRandomUsername();
    await model.signupInit.fillUsername(identifier);
    await model.signupInit.submitPrimary();
    await model.passkeyAppend.startPasskeyOperation(false);
    await model.expectScreen(ScreenNames.PasskeyError);

    await model.passkeyAppend.retryPasskeyOperation(true);

    await model.expectScreen(ScreenNames.End);
  });

  // this tests a dead end scenario where passkeys are not available but the user can not signup
  // TODO: fix
  test.skip('signup with fallback (passkeys not available)', async ({ model }) => {
    await model.load(projectId, port, false, 'signup-init');

    const identifier = SignupInitBlockModel.generateRandomUsername();
    await model.signupInit.fillUsername(identifier);
    await model.signupInit.submitPrimary();

    await model.expectError('Something went wrong. Please try again later.');
  });
});
