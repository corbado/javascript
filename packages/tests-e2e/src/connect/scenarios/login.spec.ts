import type { ChildProcess } from 'node:child_process';

import { expect, test } from '@playwright/test';

import { LoginPage, LoginStatus } from '../models/LoginPage';
import { VirtualAuthenticator } from '../utils/VirtualAuthenticator';
import { TestDataFactory } from '../utils/TestDataFactory';
import { ProfileStatus } from '../models/ProfilePage';
import { AuthenticatorApp } from '../utils/AuthenticatorApp';
import { killPlaygroundNew, spawnPlaygroundNew } from '../utils/Playground';

test.describe('login flows', () => {
  let server: ChildProcess;
  let port: number;

  test.beforeAll(async () => {
    ({ server, port } = await spawnPlaygroundNew());
  });

  test.afterAll(() => {
    killPlaygroundNew(server);
  });

  test('testLoginWithTextField', async ({ page }) => {
    await page.goto(`${process.env.PLAYWRIGHT_TEST_URL}:${port.toString()}/login?invitationToken=inv-token-correct`);
    const loginPage = new LoginPage(page);
    const signupPage = await loginPage.navigateToSignup();
    const virtualAuthenticator = await VirtualAuthenticator.init(page);
    await virtualAuthenticator.modeComplete();

    const email = TestDataFactory.generateEmail();
    const postLoginPage = await signupPage.submit(email, TestDataFactory.phoneNumber, TestDataFactory.password);
    const profilePage = await postLoginPage.continue(true);
    await profilePage.awaitPage();

    await virtualAuthenticator.modeCancel();
    const loginPage2 = await profilePage.logout();

    await loginPage2.switchAccount();

    await virtualAuthenticator.modeComplete();
    const profilePage2 = await loginPage2.loginWithIdentifier(email);
    await profilePage2.awaitPage();

    expect(await profilePage2.awaitState(ProfileStatus.ListWithPasskeys)).toBeTruthy();
  });

  test('testLoginWithOneTap', async ({ page }) => {
    await page.goto(`${process.env.PLAYWRIGHT_TEST_URL}:${port.toString()}/login?invitationToken=inv-token-correct`);
    const loginPage = new LoginPage(page);
    const signupPage = await loginPage.navigateToSignup();
    const virtualAuthenticator = await VirtualAuthenticator.init(page);
    await virtualAuthenticator.modeComplete();

    const email = TestDataFactory.generateEmail();
    const postLoginPage = await signupPage.submit(email, TestDataFactory.phoneNumber, TestDataFactory.password);
    const profilePage = await postLoginPage.continue(true);
    await profilePage.awaitPage();
    const loginPage2 = await profilePage.logout();

    // cancel first one-tap
    await virtualAuthenticator.modeCancel();
    await loginPage2.loginWithOneTapAndCancel();

    // then succeed
    await virtualAuthenticator.modeComplete();
    const profilePage2 = await loginPage2.loginWithOneTap();
    await profilePage2.awaitPage();

    expect(await profilePage2.awaitState(ProfileStatus.ListWithPasskeys)).toBeTruthy();
  });

  test('testLoginWithCUI', async ({ page }) => {
    await page.goto(`${process.env.PLAYWRIGHT_TEST_URL}:${port.toString()}/login?invitationToken=inv-token-correct`);
    const loginPage = new LoginPage(page);
    const signupPage = await loginPage.navigateToSignup();
    const virtualAuthenticator = await VirtualAuthenticator.init(page);
    await virtualAuthenticator.modeComplete();

    const email = TestDataFactory.generateEmail();
    const postLoginPage = await signupPage.submit(email, TestDataFactory.phoneNumber, TestDataFactory.password);
    const profilePage = await postLoginPage.continue(true);
    await profilePage.awaitPage();

    const loginPage2 = await profilePage.logout();
    await loginPage2.switchAccount();
    await loginPage2.loginWithCUI().awaitPage();
  });

  test('testLoginErrorStates', async ({ page }) => {
    await page.goto(`${process.env.PLAYWRIGHT_TEST_URL}:${port.toString()}/login?invitationToken=inv-token-correct`);
    const loginPage = new LoginPage(page);
    await VirtualAuthenticator.init(page);
    const nonExistingEmail = 'integration-test+0000000000@corbado.com';

    expect(await loginPage.awaitState(LoginStatus.PasskeyTextField)).toBeTruthy();
    await loginPage.loginWithIdentifierButNoSuccess(nonExistingEmail);
    expect(await loginPage.awaitState(LoginStatus.PasskeyTextField)).toBeTruthy();
    expect(loginPage.awaitErrorMessage('There is no account registered to that email address.')).toBeTruthy();
  });

  test('testLoginErrorStatesGradualRollout', async ({ page }) => {
    await page.goto(`${process.env.PLAYWRIGHT_TEST_URL}:${port.toString()}/login`);
    const loginPage = new LoginPage(page);
    const signupPage = await loginPage.navigateToSignup();
    const virtualAuthenticator = await VirtualAuthenticator.init(page);
    await virtualAuthenticator.modeComplete();

    const email = TestDataFactory.generateEmail();
    const postLoginPage = await signupPage.submit(email, TestDataFactory.phoneNumber, TestDataFactory.password);
    const mfaPage = await postLoginPage.autoSkipAfterSignup().awaitPage();

    const authenticator = new AuthenticatorApp();
    const [sharedKey, profilePage] = await mfaPage.setupAndConfirmTOTPReturnProfile(authenticator);
    await profilePage.awaitPage();
    expect(await profilePage.awaitState(ProfileStatus.ListWithoutPasskeySupport)).toBeTruthy();

    const loginPage2 = await profilePage.logout();
    expect(await loginPage2.awaitState(LoginStatus.FallbackFirst)).toBeTruthy();
    await loginPage2.loginWithIdentifierAndPassword(email, TestDataFactory.password);
    expect(await loginPage2.awaitState(LoginStatus.FallbackSecondTOTP)).toBeTruthy();
    const codeFirst = await authenticator.getCode(sharedKey);
    const postLoginPage2 = await loginPage2.completeLoginWithTOTP(codeFirst!);
    await postLoginPage2.autoSkip().awaitPage();
  });

  test('testLoginErrorStatesPasskeyDeletedServerSide', async ({ page }) => {
    await page.goto(`${process.env.PLAYWRIGHT_TEST_URL}:${port.toString()}/login?invitationToken=inv-token-correct`);
    const loginPage = new LoginPage(page);
    const signupPage = await loginPage.navigateToSignup();
    const virtualAuthenticator = await VirtualAuthenticator.init(page);
    await virtualAuthenticator.modeComplete();

    const email = TestDataFactory.generateEmail();
    const postLoginPage = await signupPage.submit(email, TestDataFactory.phoneNumber, TestDataFactory.password);
    const profilePage = await postLoginPage.continue(true);
    await profilePage.awaitPage();
    expect(await profilePage.awaitState(ProfileStatus.ListWithPasskeys)).toBeTruthy();
    await profilePage.deletePasskeyByIndex(0, true);
    const loginPage2 = await profilePage.logout();

    await loginPage2.awaitErrorMessage('You previously deleted this passkey. Use your password to log in instead.');
    expect(await loginPage2.awaitState(LoginStatus.FallbackFirst)).toBeTruthy();
  });
});
