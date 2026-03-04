import type { ChildProcess } from 'node:child_process';

import { test } from '../../fixtures/ObserveAuth';
import { OtpCodeType } from '../../models/corbado-auth-blocks/EmailVerifyBlockModel';
import { ToolingSidebarModel } from '../../models/ToolingSidebarModel';
import { ScreenNames } from '../../utils/constants';
import { getObserveProjectId } from '../../utils/observe';
import { killPlaygroundNew, spawnPlaygroundNew } from '../../utils/playground';

async function startIdentifierLogin(email: string, model: any) {
  await model.loginInit.fillEmailUsername(email);
  await model.loginInit.submitPrimary();
}

test.describe('observe: identifier-email_otp', () => {
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

  test('successful (user_no_pk) (confirmed_user_without_pk)', async ({ model, page }) => {
    const tooling = new ToolingSidebarModel(page);
    await model.load(projectId, port, 'login-init');
    const { email } = await tooling.createUser('confirmed_user_without_pk');

    await startIdentifierLogin(email, model);
    await model.expectScreen(ScreenNames.EmailOtpLogin);
    await model.emailVerify.fillOtpCode(OtpCodeType.Correct);
    await model.expectScreen(ScreenNames.PasskeyAppend2);
    await model.passkeyAppend.skip();
    await model.expectScreen(ScreenNames.End);
  });

  test('successful after wrong_code (confirmed_user_without_pk)', async ({ model, page }) => {
    const tooling = new ToolingSidebarModel(page);
    await model.load(projectId, port, 'login-init');
    const { email } = await tooling.createUser('confirmed_user_without_pk');

    await startIdentifierLogin(email, model);
    await model.expectScreen(ScreenNames.EmailOtpLogin);
    await model.emailVerify.fillOtpCode(OtpCodeType.Incorrect);
    await model.emailVerify.expectErrorWrongCode();
    await model.emailVerify.fillOtpCode(OtpCodeType.Correct);
    await model.expectScreen(ScreenNames.PasskeyAppend2);
    await model.passkeyAppend.skip();
    await model.expectScreen(ScreenNames.End);
  });

  test('successful after wrong_code (2x) (confirmed_user_without_pk)', async ({ model, page }) => {
    const tooling = new ToolingSidebarModel(page);
    await model.load(projectId, port, 'login-init');
    const { email } = await tooling.createUser('confirmed_user_without_pk');

    await startIdentifierLogin(email, model);
    await model.expectScreen(ScreenNames.EmailOtpLogin);
    await model.emailVerify.fillOtpCode(OtpCodeType.Incorrect);
    await model.emailVerify.expectErrorWrongCode();
    await model.emailVerify.fillOtpCode(OtpCodeType.Incorrect);
    await model.emailVerify.expectErrorWrongCode();
    await model.emailVerify.fillOtpCode(OtpCodeType.Correct);
    await model.expectScreen(ScreenNames.PasskeyAppend2);
    await model.passkeyAppend.skip();
    await model.expectScreen(ScreenNames.End);
  });

  test('incomplete after wrong_code (confirmed_user_without_pk)', async ({ model, page }) => {
    const tooling = new ToolingSidebarModel(page);
    await model.load(projectId, port, 'login-init');
    const { email } = await tooling.createUser('confirmed_user_without_pk');

    await startIdentifierLogin(email, model);
    await model.expectScreen(ScreenNames.EmailOtpLogin);
    await model.emailVerify.fillOtpCode(OtpCodeType.Incorrect);
    await model.emailVerify.expectErrorWrongCode();
    await model.expectScreen(ScreenNames.EmailOtpLogin);
  });

  test('successful after cancelled passkey (confirmed_user_with_pk)', async ({ model, page }) => {
    const tooling = new ToolingSidebarModel(page);
    await model.load(projectId, port, 'login-init');
    const { email } = await tooling.createUser('confirmed_user_with_pk');
    await tooling.setPasskeyLoginWithIdentifier('cancel');
    await tooling.applyAuthenticatorSettings();

    await startIdentifierLogin(email, model);
    await model.page.getByRole('button', { name: 'Continue with email' }).click();
    await model.expectScreen(ScreenNames.EmailOtpLogin);
    await model.emailVerify.fillOtpCode(OtpCodeType.Correct);
    await model.page.getByRole('button', { name: 'Skip' }).click();
    await model.expectScreen(ScreenNames.End);
  });
});
