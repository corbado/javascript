import type { ChildProcess } from 'node:child_process';

import { test } from '../../fixtures/ObserveAuth';
import { ToolingSidebarModel } from '../../models/ToolingSidebarModel';
import { ScreenNames } from '../../utils/constants';
import { getObserveProjectId } from '../../utils/observe';
import { killPlaygroundNew, spawnPlaygroundNew } from '../../utils/playground';

test.describe('observe: reset-flow', () => {
  let projectId: string;
  let server: ChildProcess | undefined;
  let port: number;

  test.beforeAll(async () => {
    projectId = getObserveProjectId();
    ({ server, port } = await spawnPlaygroundNew(projectId));
  });

  test.afterAll(() => {
    if (server) {
      killPlaygroundNew(server);
    }
  });

  test('successful with passkey-cui, same identifier after cancelled passkey', async ({ model, page }) => {
    const tooling = new ToolingSidebarModel(page);
    const { email } = await model.load(projectId, port, 'login-init', {
      setLoginWithIdentifier: 'cancel',
      setLoginWithoutIdentifier: 'not-started',
      createInitialUser: 'confirmed_user_with_pk',
    });

    await model.loginInit.fillEmailUsername(email);
    await model.loginInit.submitPrimary();
    await model.expectScreen(ScreenNames.PasskeyErrorSoft);

    await tooling.setPasskeyLoginWithoutIdentifier('complete');
    await tooling.applyAuthenticatorSettings();

    await page.waitForTimeout(1000);
    await model.passkeyVerify.resetToLoginStart();
    await page.waitForTimeout(1000);
    await model.expectScreen(ScreenNames.End);
  });

  test('successful with passkey-cui, different identifier after cancelled passkey', async ({ model, page }) => {
    const tooling = new ToolingSidebarModel(page);
    const { email } = await model.load(projectId, port, 'login-init', {
      setLoginWithIdentifier: 'cancel',
      setLoginWithoutIdentifier: 'not-started',
      createInitialUser: 'confirmed_user_with_pk',
    });
    await model.loginInit.fillEmailUsername(email);
    await model.loginInit.submitPrimary();
    await model.expectScreen(ScreenNames.PasskeyErrorSoft);

    await tooling.setPasskeyLoginWithoutIdentifier('complete');
    await tooling.applyAuthenticatorSettings();
    await tooling.createUser('confirmed_user_with_pk');

    await model.passkeyVerify.resetToLoginStart();
    await model.expectScreen(ScreenNames.End);
  });
});
