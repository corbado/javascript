import type { ChildProcess } from 'node:child_process';

import { test } from '../../fixtures/ObserveAuth';
import { ToolingSidebarModel } from '../../models/ToolingSidebarModel';
import { ScreenNames } from '../../utils/constants';
import { getObserveProjectId } from '../../utils/observe';
import { killPlaygroundNew, spawnPlaygroundNew } from '../../utils/playground';
import { OtpCodeType } from '../../models/corbado-auth-blocks/EmailVerifyBlockModel';

async function configureSocialMock(
  tooling: ToolingSidebarModel,
  email: string,
  behavior: 'success' | 'cancel' | 'navigate_back',
) {
  await tooling.setMockSocialUser(email);
  await tooling.setSocialBehavior(behavior);
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

test.describe('observe: social-mock', () => {
  let projectId: string;
  let server: ChildProcess | undefined;
  let port: number;

  test.beforeAll(async () => {
    projectId = getObserveProjectId();
    ({ server, port } = await spawnPlaygroundNew(projectId, { fixedPort: 3000 }));
  });

  test.afterAll(() => {
    if (server) {
      killPlaygroundNew(server);
    }
  });

  test('successful (confirmed_user_without_pk)', async ({ model, page }) => {
    const tooling = new ToolingSidebarModel(page);
    const {email} = await model.load(projectId, port, 'login-init', {
      createInitialUser: 'confirmed_user_without_pk',
    });
    await configureSocialMock(tooling, email, 'success');

    await model.loginInit.submitSocialLocal();
    await page.waitForTimeout(1000);
    await completePostLoginIfNeeded(model);
    await model.expectScreen(ScreenNames.End);
  });

  test('successful after cancelled (confirmed_user_without_pk)', async ({ model, page }) => {
    const tooling = new ToolingSidebarModel(page);
    const {email} = await model.load(projectId, port, 'login-init', {
      createInitialUser: 'confirmed_user_without_pk',
    });
    await configureSocialMock(tooling, email, 'cancel');

    await model.loginInit.submitSocialLocal();
    await model.expectScreen(ScreenNames.InitLogin);

    await model.expectError('Something went wrong. Please try again later');
    await configureSocialMock(tooling, email, 'success');
    await model.loginInit.submitSocialLocal();
    await page.waitForTimeout(1000);

    await completePostLoginIfNeeded(model);
    await model.expectScreen(ScreenNames.End);
  });

  test('successful after back (confirmed_user_without_pk)', async ({ model, page }) => {
    const tooling = new ToolingSidebarModel(page);
    const {email} = await model.load(projectId, port, 'login-init', {
      createInitialUser: 'confirmed_user_without_pk',
    });
    await configureSocialMock(tooling, email, 'navigate_back');

    await model.loginInit.submitSocialLocal();
    await model.expectScreen(ScreenNames.InitLogin);
    await page.waitForTimeout(1000);

    await configureSocialMock(tooling, email, 'success');
    await model.loginInit.submitSocialLocal();
    await page.waitForTimeout(1000);
    await completePostLoginIfNeeded(model);
    await model.expectScreen(ScreenNames.End);
  });

  test('incomplete after cancelled (confirmed_user_without_pk)', async ({ model, page }) => {
    const tooling = new ToolingSidebarModel(page);
    const {email} = await model.load(projectId, port, 'login-init', {
      createInitialUser: 'confirmed_user_without_pk',
    });
    await configureSocialMock(tooling, email, 'cancel');

    await model.loginInit.submitSocialLocal();
    await model.expectScreen(ScreenNames.InitLogin);
  });

  test('successful with social-mock, same identifier after cancelled passkey', async ({ model, page }) => {
    const tooling = new ToolingSidebarModel(page);
    const {email} = await model.load(projectId, port, 'login-init', {
      setLoginWithIdentifier: 'cancel',
      createInitialUser: 'confirmed_user_with_pk',
    });
    await configureSocialMock(tooling, email, 'success');

    await model.loginInit.fillEmailUsername(email);
    await model.loginInit.submitPrimary();
    await model.passkeyVerify.resetToLoginStart();
    await model.expectScreen(ScreenNames.InitLogin);

    await model.loginInit.submitSocialLocal();
    await model.expectScreen(ScreenNames.End);
  });

  test('successful with social-mock, same identifier after incomplete identifier-email_otp', async ({
    model,
    page,
  }) => {
    const tooling = new ToolingSidebarModel(page);
    const {email} = await model.load(projectId, port, 'login-init', {
      createInitialUser: 'confirmed_user_without_pk',
    });
    await configureSocialMock(tooling, email, 'success');

    await model.loginInit.fillEmailUsername(email);
    await model.loginInit.submitPrimary();
    await model.expectScreen(ScreenNames.EmailOtpLogin);
    await model.emailVerify.fillOtpCode(OtpCodeType.Incorrect);
    await model.emailVerify.expectErrorWrongCode();
    await model.emailVerify.navigateToEditIdentifier();
    await model.expectScreen(ScreenNames.InitLogin);

    await model.loginInit.submitSocialLocal();
    await page.waitForTimeout(1000);
    await completePostLoginIfNeeded(model);
    await model.expectScreen(ScreenNames.End);
  });
});
