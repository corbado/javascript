import type { ChildProcess } from 'node:child_process';

import { passkeyListTest } from '../../fixtures/PasskeyList';
import { IdentifierEnforceVerification, IdentifierType, IdentifierVerification } from '../../utils/constants';
import { createProjectNew, deleteProjectNew, makeIdentifier, setComponentConfig } from '../../utils/developerpanel';
import { killPlaygroundNew, spawnPlaygroundNew } from '../../utils/playground';

passkeyListTest.describe('passkey list - general', () => {
  let projectId: string;
  let server: ChildProcess;
  let port: number;

  passkeyListTest.beforeAll(async () => {
    projectId = await createProjectNew();

    await setComponentConfig(projectId, [
      makeIdentifier(IdentifierType.Email, IdentifierEnforceVerification.Signup, true, [
        IdentifierVerification.EmailOtp,
      ]),
    ]);

    ({ server, port } = await spawnPlaygroundNew(projectId));
  });

  passkeyListTest.afterAll(async () => {
    await deleteProjectNew(projectId);

    killPlaygroundNew(server);
  });

  passkeyListTest('passkey list allows adding and deleting passkeys (passkeys are supported)', async ({ model }) => {
    await model.load(projectId, port, true);

    await model.expectPasskeys(0);
    await model.appendNewPasskey(true);
    await model.expectPasskeys(1);
    await model.deletePasskey(0);
    await model.expectPasskeys(0);
  });

  // currently it seems impossible to test for duplicate passkeys with virtual authenticator
  passkeyListTest('passkey list error handling (cancel, duplicate passkeys)', async ({ model }) => {
    await model.load(projectId, port, true);

    await model.expectPasskeys(0);
    await model.appendNewPasskey(false);
    // currently, we don't show an error message here
    await model.expectPasskeys(0);

    await model.appendNewPasskey(true);
    await model.expectPasskeys(1);
  });
});
