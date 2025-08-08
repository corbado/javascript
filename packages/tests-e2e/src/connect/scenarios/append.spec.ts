import type { ChildProcess } from 'node:child_process';

import { expect, test } from '@playwright/test';

import { LoginPage, LoginStatus } from '../models/LoginPage';
import { ProfileStatus } from '../models/ProfilePage';
import { AuthenticatorApp } from '../utils/AuthenticatorApp';
import { TestDataFactory } from '../utils/TestDataFactory';
import { VirtualAuthenticator } from '../utils/VirtualAuthenticator';
import { killPlaygroundNew, spawnPlaygroundNew } from '../utils/Playground';

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
    await postLoginPage.continueWithCancel(true);
    await postLoginPage.continueWithCancel(false);
    expect(
      await postLoginPage.awaitErrorMessage('You have cancelled setting up your passkey. Please try again.'),
    ).toBeTruthy();

    await virtualAuthenticator.modeComplete();
    const profilePage = await postLoginPage.continue(false);
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

  test('testAppendAfterSignUpSkipped', async ({ page }) => {
    test.setTimeout(120000); // 120 seconds
    await page.goto(`${process.env.PLAYWRIGHT_TEST_URL}:${port.toString()}/login?invitationToken=inv-token-correct`);
    const loginPage = new LoginPage(page);
    const signupPage = await loginPage.navigateToSignup();
    const virtualAuthenticator = await VirtualAuthenticator.init(page);

    const email = TestDataFactory.generateEmail();

    // First attempt to create passkey is cancelled, user skips, then sets up TOTP and logs in later
    await virtualAuthenticator.modeCancel();
    const postLoginPage = await signupPage.submit(email, TestDataFactory.phoneNumber, TestDataFactory.password);
    const mfaPage = await postLoginPage.skipAfterSignup();

    // Confirm TOTP to end on profile
    const authenticator = new AuthenticatorApp();
    const [sharedKey, profilePage] = await mfaPage.setupAndConfirmTOTPReturnProfile(authenticator);

    // Initially no passkeys
    expect(await profilePage.getPasskeyCount()).toBe(0);

    const loginPage2 = await profilePage.logout();
    await virtualAuthenticator.modeCancel();
    expect(await loginPage2.awaitState(LoginStatus.PasskeyTextField)).toBeTruthy();
    await loginPage2.loginWithIdentifierAndPasswordIdentifierFirst(email, TestDataFactory.password);
    expect(await loginPage2.awaitState(LoginStatus.FallbackSecondTOTP)).toBeTruthy();

    // MFA page appears, confirm with next code
    const codeFirst = await authenticator.getCode(sharedKey);
    const postLoginPage2 = await loginPage2.completeLoginWithTOTP(codeFirst!);
    const profilePage2 = await postLoginPage2.skip();

    await virtualAuthenticator.modeComplete();
    expect(await profilePage2.awaitState(ProfileStatus.ListEmpty)).toBeTruthy();
    await profilePage2.appendPasskey();
    expect(await profilePage2.awaitState(ProfileStatus.ListWithPasskeys)).toBeTruthy();
    const loginPage3 = await profilePage2.logout();

    expect(await loginPage3.awaitState(LoginStatus.PasskeyOneTap)).toBeTruthy();
    const profilePage3 = await loginPage3.loginWithOneTap();
    expect(await profilePage3.awaitState(ProfileStatus.ListWithPasskeys)).toBeTruthy();
    expect(await profilePage3.getPasskeyCount()).toBe(1);
    await profilePage3.deletePasskeyByIndex(0, true);
    expect(await profilePage3.awaitState(ProfileStatus.ListEmpty)).toBeTruthy();

    await virtualAuthenticator.modeCancel();
    const loginPage4 = await profilePage3.logout();
    expect(await loginPage4.awaitState(LoginStatus.PasskeyTextField)).toBeTruthy();
    await virtualAuthenticator.modeComplete();
    await loginPage4.loginWithIdentifierAndPasswordIdentifierFirst(email, TestDataFactory.password);
    expect(await loginPage4.awaitState(LoginStatus.FallbackSecondTOTP)).toBeTruthy();
    const codeSecond = await authenticator.getCode(sharedKey);
    const postLoginPage3 = await loginPage4.completeLoginWithTOTP(codeSecond!);
    await postLoginPage3.awaitPage();
  });
});
