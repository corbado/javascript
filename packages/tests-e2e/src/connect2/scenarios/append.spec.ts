import type { ChildProcess } from 'node:child_process';

import { expect, test } from '@playwright/test';

import { killPlaygroundNew, spawnPlaygroundNew } from '../../connect/utils/Playground';
import { LoginPage, LoginStatus } from '../models/LoginPage';
import { TestDataFactory } from '../utils/TestDataFactory';
import { VirtualAuthenticator } from '../utils/VirtualAuthenticator';
import { ProfileStatus } from '../models/ProfilePage';

test.describe('append flows', () => {
  let server: ChildProcess;
  let port: number;

  test.beforeAll(async () => {
    ({ server, port } = await spawnPlaygroundNew());
  });

  test.afterAll(() => {
    killPlaygroundNew(server);
  });

  test('testAppendAfterSignUp', async ({ page }) => {
    await page.goto(`${process.env.PLAYWRIGHT_TEST_URL}:${port.toString()}/login?invitationToken=inv-token-correct`);
    const loginPage = new LoginPage(page);
    const signupPage = await loginPage.navigateToSignup();
    const virtualAuthenticator = await VirtualAuthenticator.init(page);

    const email = TestDataFactory.generateEmail();

    await virtualAuthenticator.modeCancel();
    const postLoginPage = await signupPage.submit(email, TestDataFactory.phoneNumber, TestDataFactory.password);
    const postLoginPage2 = await postLoginPage.continueWithCancel(true);
    const postLoginPage3 = await postLoginPage2.continueWithCancel(false);
    expect(
      await postLoginPage3.awaitErrorMessage('You have cancelled setting up your passkey. Please try again.'),
    ).toBeTruthy();

    await virtualAuthenticator.modeComplete();
    const profilePage = await postLoginPage3.continue(false);
    expect(await profilePage.awaitState(ProfileStatus.ListWithPasskeys)).toBeTruthy();
    expect(await profilePage.getPasskeyCount()).toBe(1);
    const loginPage2 = await profilePage.logout();

    expect(await loginPage2.awaitState(LoginStatus.PasskeyOneTap)).toBeTruthy();
    const postLoginPage4 = await loginPage2.loginWithOneTap();
    expect(await profilePage.awaitState(ProfileStatus.ListWithPasskeys)).toBeTruthy();
    await postLoginPage4.appendPasskey();
    await postLoginPage4.awaitErrorMessage('No passkey created');
    expect(await profilePage.getPasskeyCount()).toBe(1);
  });

  test.skip('testAppendAfterSignUpSkipped', async ({ page }) => {});
});
