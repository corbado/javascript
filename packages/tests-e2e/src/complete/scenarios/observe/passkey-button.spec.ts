import type { ChildProcess } from 'node:child_process';

import { test } from '../../fixtures/ObserveAuth';
import { OtpCodeType } from '../../models/corbado-auth-blocks/EmailVerifyBlockModel';
import type { ObserveAuthModel } from '../../models/ObserveAuthModel';
import { ToolingSidebarModel } from '../../models/ToolingSidebarModel';
import { ScreenNames } from '../../utils/constants';
import { getObserveProjectId } from '../../utils/observe';
import { killPlaygroundNew, spawnPlaygroundNew } from '../../utils/playground';

async function preparePasskeyButtonState(email: string, model: ObserveAuthModel) {
  await model.loginInit.fillEmailUsername(email);
  await model.loginInit.submitPrimary();
  await model.expectScreen(ScreenNames.End);
  await model.logout();
  await model.expectScreen(ScreenNames.InitLogin);
  await model.loginInit.expectPasskeyButton(true);
}

async function completePostLoginIfNeeded(model: any) {
  const maybeLater = model.page.getByRole('button', { name: 'Maybe later' });
  if (await maybeLater.isVisible().catch(() => false)) {
    await maybeLater.click();
  }

  const skip = model.page.getByRole('button', { name: 'Skip' });
  if (await skip.isVisible().catch(() => false)) {
    await skip.click();
  }
}

test.describe('observe: passkey-button', () => {
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

  test('successful identifier-passkey (passkey-button)', async ({ model }) => {
    const { email } = await model.load(projectId, port, 'login-init', {
      setLoginWithIdentifier: 'complete',
      createInitialUser: 'confirmed_user_with_pk',
    });
    await preparePasskeyButtonState(email, model);

    await model.loginInit.submitPasskeyButton();
    await model.expectScreen(ScreenNames.End);
  });

  test('successful identifier-passkey (passkey-button, 1 cancel)', async ({ model, page }) => {
    const tooling = new ToolingSidebarModel(page);
    const { email } = await model.load(projectId, port, 'login-init', {
      setLoginWithIdentifier: 'complete',
      setLoginWithoutIdentifier: 'not-started',
      createInitialUser: 'confirmed_user_with_pk',
    });
    await preparePasskeyButtonState(email, model);

    await tooling.setPasskeyLoginWithIdentifier('cancel');
    await tooling.applyAuthenticatorSettings();
    await model.loginInit.submitPasskeyButton();
    await model.expectScreen(ScreenNames.PasskeyErrorSoft);

    await tooling.setPasskeyLoginWithIdentifier('complete');
    await tooling.applyAuthenticatorSettings();
    await model.passkeyVerify.retryPasskeyFromSoft();
    await model.expectScreen(ScreenNames.End);
  });

  test('successful identifier-passkey (passkey-button, 2 cancel)', async ({ model, page }) => {
    const tooling = new ToolingSidebarModel(page);
    const { email } = await model.load(projectId, port, 'login-init', {
      setLoginWithIdentifier: 'complete',
      setLoginWithoutIdentifier: 'not-started',
      createInitialUser: 'confirmed_user_with_pk',
    });
    await preparePasskeyButtonState(email, model);

    await tooling.setPasskeyLoginWithIdentifier('cancel');
    await tooling.applyAuthenticatorSettings();
    await model.loginInit.submitPasskeyButton();
    await model.expectScreen(ScreenNames.PasskeyErrorSoft);

    await model.passkeyVerify.retryPasskeyFromSoft();
    await model.expectScreen(ScreenNames.PasskeyError);

    await tooling.setPasskeyLoginWithIdentifier('complete');
    await tooling.applyAuthenticatorSettings();
    await model.passkeyVerify.retryPasskeyFromHard();
    await model.expectScreen(ScreenNames.End);
  });

  test('successful identifier-email_otp (passkey-button)', async ({ model, page }) => {
    const tooling = new ToolingSidebarModel(page);
    const { email } = await model.load(projectId, port, 'login-init', {
      setLoginWithIdentifier: 'complete',
      setLoginWithoutIdentifier: 'not-started',
      createInitialUser: 'confirmed_user_with_pk',
    });
    await preparePasskeyButtonState(email, model);

    await tooling.setPasskeyLoginWithIdentifier('cancel');
    await tooling.applyAuthenticatorSettings();
    await model.loginInit.submitPasskeyButton();
    await model.expectScreen(ScreenNames.PasskeyErrorSoft);

    await model.passkeyVerify.continueWithEmail();
    await model.expectScreen(ScreenNames.EmailOtpLogin);
    await model.emailVerify.fillOtpCode(OtpCodeType.Correct);

    await page.waitForTimeout(1000); // Wait for potential screen transition
    await completePostLoginIfNeeded(model);
    await model.expectScreen(ScreenNames.End);
  });

  test('successfull identifier-passkey (declined passkey-button)', async ({ model }) => {
    const { email } = await model.load(projectId, port, 'login-init', {
      setLoginWithIdentifier: 'complete',
      setLoginWithoutIdentifier: 'not-started',
      createInitialUser: 'confirmed_user_with_pk',
    });
    await preparePasskeyButtonState(email, model);

    await model.loginInit.removePasskeyButton();

    await model.loginInit.fillEmailUsername(email);
    await model.loginInit.submitPrimary();
    await model.expectScreen(ScreenNames.End);
  });
});
