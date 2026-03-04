import type { ChildProcess } from 'node:child_process';

import { expect } from '@playwright/test';
import { test } from '../../fixtures/ObserveAuth';
import { ToolingSidebarModel } from '../../models/ToolingSidebarModel';
import { ScreenNames } from '../../utils/constants';
import { getObserveProjectId } from '../../utils/observe';
import { killPlaygroundNew, spawnPlaygroundNew } from '../../utils/playground';

async function startIdentifierPasskeyLogin(email: string, model: any) {
  await model.loginInit.fillEmailUsername(email);
  await model.loginInit.submitPrimary();
}

async function retryPasskeyOnVerifyScreen(model: any) {
  const retry = model.page.getByRole('button', { name: 'Try again' });
  if (await retry.isVisible()) {
    await retry.click();
    return;
  }
  await model.page.getByRole('button', { name: 'Login with passkey' }).click();
}

test.describe('observe: identifier-passkey', () => {
  let projectId: string;
  let server: ChildProcess | undefined;
  let port: number;

  test.beforeAll(async () => {
    projectId = getObserveProjectId();
    ({ server, port } = await spawnPlaygroundNew(projectId));
  });

  test.afterAll(async () => {
    if (server) {
      killPlaygroundNew(server);
    }
  });

  test('successful (confirmed_user_with_pk)', async ({ model, page }) => {
    const tooling = new ToolingSidebarModel(page);
    await model.load(projectId, port, 'login-init');
    const { email } = await tooling.createUser('confirmed_user_with_pk');
    await tooling.setPasskeyLoginWithIdentifier('complete');
    await tooling.applyAuthenticatorSettings();

    await startIdentifierPasskeyLogin(email, model);
    await model.expectScreen(ScreenNames.End);
  });

  test('successful after cancelled (confirmed_user_with_pk)', async ({ model, page }) => {
    const tooling = new ToolingSidebarModel(page);
    await model.load(projectId, port, 'login-init');
    const { email } = await tooling.createUser('confirmed_user_with_pk');
    await tooling.setPasskeyLoginWithIdentifier('cancel');
    await tooling.applyAuthenticatorSettings();

    await startIdentifierPasskeyLogin(email, model);
    await expect(model.page.getByRole('button', { name: 'Continue with email' })).toBeVisible();

    await tooling.setPasskeyLoginWithIdentifier('complete');
    await tooling.applyAuthenticatorSettings();
    await retryPasskeyOnVerifyScreen(model);
    await model.expectScreen(ScreenNames.End);
  });

  test('successful after cancelled (2x) (confirmed_user_with_pk)', async ({ model, page }) => {
    const tooling = new ToolingSidebarModel(page);
    await model.load(projectId, port, 'login-init');
    const { email } = await tooling.createUser('confirmed_user_with_pk');
    await tooling.setPasskeyLoginWithIdentifier('cancel');
    await tooling.applyAuthenticatorSettings();

    await startIdentifierPasskeyLogin(email, model);
    await expect(model.page.getByRole('button', { name: 'Continue with email' })).toBeVisible();
    await retryPasskeyOnVerifyScreen(model);
    await expect(model.page.getByRole('button', { name: 'Continue with email' })).toBeVisible();

    await tooling.setPasskeyLoginWithIdentifier('complete');
    await tooling.applyAuthenticatorSettings();
    await retryPasskeyOnVerifyScreen(model);
    await model.expectScreen(ScreenNames.End);
  });

  test('incomplete after cancelled (confirmed_user_with_pk)', async ({ model, page }) => {
    const tooling = new ToolingSidebarModel(page);
    await model.load(projectId, port, 'login-init');
    const { email } = await tooling.createUser('confirmed_user_with_pk');
    await tooling.setPasskeyLoginWithIdentifier('cancel');
    await tooling.applyAuthenticatorSettings();

    await startIdentifierPasskeyLogin(email, model);
    await expect(model.page.getByRole('button', { name: 'Continue with email' })).toBeVisible();
  });

  test('incomplete after cancelled (2x) (confirmed_user_with_pk)', async ({ model, page }) => {
    const tooling = new ToolingSidebarModel(page);
    await model.load(projectId, port, 'login-init');
    const { email } = await tooling.createUser('confirmed_user_with_pk');
    await tooling.setPasskeyLoginWithIdentifier('cancel');
    await tooling.applyAuthenticatorSettings();

    await startIdentifierPasskeyLogin(email, model);
    await expect(model.page.getByRole('button', { name: 'Continue with email' })).toBeVisible();
    await retryPasskeyOnVerifyScreen(model);
    await expect(model.page.getByRole('button', { name: 'Continue with email' })).toBeVisible();
  });
});
