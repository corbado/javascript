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
    await model.load(projectId, port, 'login-init', {
      enabled: true,
      login: { withIdentifier: 'cancel', withoutIdentifier: 'not-started' },
      create: { action: 'complete' },
    });
    const { email } = await tooling.createUser('confirmed_user_with_pk');

    await model.loginInit.fillEmailUsername(email);
    await model.loginInit.submitPrimary();
    await model.expectScreen(ScreenNames.PasskeyErrorSoft);

    await tooling.setPasskeyLoginWithoutIdentifier('complete');
    await tooling.applyAuthenticatorSettings();

    await model.passkeyVerify.resetToLoginStart();
    await model.expectScreen(ScreenNames.End);
  });

  test('successful with passkey-cui, different identifier after cancelled passkey', async ({ model, page }) => {
    const tooling = new ToolingSidebarModel(page);
    await model.load(projectId, port, 'login-init', {
      enabled: true,
      login: { withIdentifier: 'cancel', withoutIdentifier: 'not-started' },
      create: { action: 'complete' },
    });
    const { email } = await tooling.createUser('confirmed_user_with_pk');
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
