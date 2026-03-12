import type { ChildProcess } from 'node:child_process';

import { test } from '../../fixtures/ObserveAuth';
import { ToolingSidebarModel } from '../../models/ToolingSidebarModel';
import { ScreenNames } from '../../utils/constants';
import { getObserveProjectId } from '../../utils/observe';
import { killPlaygroundNew, spawnPlaygroundNew } from '../../utils/playground';

test.describe('observe: passkey-cui', () => {
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

  test('successful (confirmed_user_with_pk)', async ({ model }) => {
    await model.load(projectId, port, 'login-init', {
      setLoginWithIdentifier: 'complete',
      setLoginWithoutIdentifier: 'complete',
      createInitialUser: 'confirmed_user_with_pk',
    });

    await model.expectScreen(ScreenNames.InitLogin);
    await model.expectScreen(ScreenNames.End);
  });

  test('successful after cancelled (confirmed_user_with_pk)', async ({ model, page }) => {
    const tooling = new ToolingSidebarModel(page);
    await model.load(projectId, port, 'login-init', {
      setLoginWithoutIdentifier: 'complete',
      setLoginWithIdentifier: 'cancel',
      createInitialUser: 'confirmed_user_with_pk',
    });
    await model.expectScreen(ScreenNames.InitLogin);

    await tooling.setPasskeyLoginWithoutIdentifier('complete');
    await tooling.applyAuthenticatorSettings();
    await page.reload();

    await model.expectScreen(ScreenNames.End);
  });

  test('successful after pk_deleted (confirmed_user_with_server_deleted_pk)', async ({ model, page }) => {
    const tooling = new ToolingSidebarModel(page);
    const { email } = await model.load(projectId, port, 'login-init', {
      setLoginWithoutIdentifier: 'complete',
      setLoginWithIdentifier: 'not-started',
      createInitialUser: 'confirmed_user_with_server_deleted_pk',
    });

    await model.expectScreen(ScreenNames.InitLogin);
    await model.expectError(
      'The provided passkey is no longer valid. Please enter your identifier (e.g. email) manually.',
    );

    await tooling.addPasskeyToUser(email);
    await page.reload();
    await model.expectScreen(ScreenNames.End);
  });

  test('incomplete after pk_deleted (confirmed_user_with_server_deleted_pk)', async ({ model, page }) => {
    await model.load(projectId, port, 'login-init', {
      setLoginWithoutIdentifier: 'complete',
      createInitialUser: 'confirmed_user_with_server_deleted_pk',
    });

    await page.reload();
    await model.expectScreen(ScreenNames.InitLogin);
    await model.expectError(
      'The provided passkey is no longer valid. Please enter your identifier (e.g. email) manually.',
    );
  });

  test('incomplete after cancelled (confirmed_user_with_pk)', async ({ model, page }) => {
    await model.load(projectId, port, 'login-init', {
      setLoginWithoutIdentifier: 'cancel',
      createInitialUser: 'confirmed_user_with_pk',
    });

    await page.reload();
    await model.expectScreen(ScreenNames.InitLogin);
  });
});
