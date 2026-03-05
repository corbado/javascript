import type { ChildProcess } from 'node:child_process';

import { expect, test } from '@playwright/test';

import { LoginPage, LoginStatus } from '../models/LoginPage';
import { VirtualAuthenticator } from '../utils/VirtualAuthenticator';
import { TestDataFactory } from '../utils/TestDataFactory';
import { NetworkRequestBlocker } from '../utils/NetworkRequestBlocker';
import { AuthenticatorApp } from '../utils/AuthenticatorApp';
import { ProfileStatus } from '../models/ProfilePage';
import { killPlaygroundNew, spawnPlaygroundNew } from '../utils/Playground';

test.describe('network blocking flows', () => {
  let server: ChildProcess;
  let port: number;

  test.beforeAll(async () => {
    ({ server, port } = await spawnPlaygroundNew());
  });

  test.afterAll(() => {
    killPlaygroundNew(server);
  });

  test('testLoginErrorStatesNetworkBlocking', async ({ page }) => {
    await page.goto(`http://localhost:${port.toString()}/login?invitationToken=inv-token-correct`);
    const loginPage = new LoginPage(page);
    const signupPage = await loginPage.navigateToSignup();
    const virtualAuthenticator = await VirtualAuthenticator.init(page);
    await virtualAuthenticator.modeComplete();
    const networkBlocker = await NetworkRequestBlocker.init(page);

    const email = TestDataFactory.generateEmail();
    const postLoginPage = await signupPage.submit(email, TestDataFactory.phoneNumber, TestDataFactory.password);
    await postLoginPage.awaitPage();
    const profilePage = await postLoginPage.continue(true);
    await profilePage.awaitPage();

    await networkBlocker.loginInit();
    const loginPage2 = await profilePage.logout();
    expect(await loginPage2.awaitState(LoginStatus.FallbackFirst)).toBeTruthy();

    await networkBlocker.loginStart();
    await page.reload();
    expect(await loginPage2.awaitState(LoginStatus.PasskeyOneTap)).toBeTruthy();
    await virtualAuthenticator.modeCancel();
    await loginPage2.switchAccount();
    await virtualAuthenticator.modeComplete();
    await loginPage2.loginWithIdentifierButNoSuccess(email);
    expect(await loginPage2.awaitState(LoginStatus.FallbackFirst)).toBeTruthy();

    await networkBlocker.loginFinish();
    await page.reload();
    expect(await loginPage2.awaitState(LoginStatus.FallbackFirst)).toBeTruthy();

    await networkBlocker.unblockAll();
    await page.reload();
    await loginPage2.loginWithCUI().awaitPage();
  });

  test('testAppendErrorStatesPasskeyAppendBlocked', async ({ page }) => {
    await page.goto(`http://localhost:${port.toString()}/login?invitationToken=inv-token-correct`);
    const loginPage = new LoginPage(page);
    const signupPage = await loginPage.navigateToSignup();
    const virtualAuthenticator = await VirtualAuthenticator.init(page);
    await virtualAuthenticator.modeComplete();
    const networkBlocker = await NetworkRequestBlocker.init(page);

    const email = TestDataFactory.generateEmail();

    await networkBlocker.appendInit();
    const postLoginPage = await signupPage.submit(email, TestDataFactory.phoneNumber, TestDataFactory.password);
    const mfaPage = postLoginPage.autoSkipAfterSignup();

    const authenticator = new AuthenticatorApp();
    const [sharedKey, profilePage] = await mfaPage.setupAndConfirmTOTPReturnProfile(authenticator);
    expect(await profilePage.awaitState(ProfileStatus.ListEmpty)).toBeTruthy();

    await networkBlocker.appendStart();
    const loginPage2 = await profilePage.logout();
    await loginPage2.loginWithIdentifierAndPasswordIdentifierFirst(email, TestDataFactory.password);
    expect(await loginPage2.awaitState(LoginStatus.FallbackSecondTOTP)).toBeTruthy();
    const codeFirst = await authenticator.getCode(sharedKey);
    const postLoginPage2 = await loginPage2.completeLoginWithTOTP(codeFirst!);
    await postLoginPage2.autoSkip().awaitPage();

    await networkBlocker.appendFinish();
    const loginPage3 = await profilePage.logout();
    await loginPage3.loginWithIdentifierAndPasswordIdentifierFirst(email, TestDataFactory.password);
    expect(await loginPage2.awaitState(LoginStatus.FallbackSecondTOTP)).toBeTruthy();
    const codeSecond = await authenticator.getCode(sharedKey);
    const postLoginPage3 = await loginPage3.completeLoginWithTOTP(codeSecond!);
    await postLoginPage3.autoSkip().awaitPage();
  });

  test('testManageErrorStatesNetworkBlocking', async ({ page }) => {
    await page.goto(`http://localhost:${port.toString()}/login?invitationToken=inv-token-correct`);
    const loginPage = new LoginPage(page);
    const signupPage = await loginPage.navigateToSignup();
    const virtualAuthenticator = await VirtualAuthenticator.init(page);
    await virtualAuthenticator.modeComplete();
    const networkBlocker = await NetworkRequestBlocker.init(page);

    const email = TestDataFactory.generateEmail();
    const postLoginPage = await signupPage.submit(email, TestDataFactory.phoneNumber, TestDataFactory.password);
    await postLoginPage.awaitPage();
    const profilePage = await postLoginPage.continue(true);
    await profilePage.awaitPage();
    expect(await profilePage.awaitState(ProfileStatus.ListWithPasskeys)).toBeTruthy();

    await profilePage.clearProcessState();
    await networkBlocker.manageInit();
    await page.reload();
    expect(await profilePage.awaitState(ProfileStatus.ListWithInitialError)).toBeTruthy();
    expect(
      await profilePage.awaitErrorMessage('Unable to access passkeys. Check your connection and try again.'),
    ).toBeTruthy();

    await networkBlocker.manageList();
    await page.reload();
    expect(await profilePage.awaitState(ProfileStatus.ListWithInitialError)).toBeTruthy();
    expect(
      await profilePage.awaitErrorMessage('Unable to access passkeys. Check your connection and try again.'),
    ).toBeTruthy();

    await networkBlocker.appendStart();
    await page.reload();
    expect(await profilePage.awaitState(ProfileStatus.ListWithPasskeys)).toBeTruthy();
    expect(await profilePage.getPasskeyCount()).toBe(1);
    await profilePage.appendPasskey();
    expect(await profilePage.awaitErrorMessage('Passkey creation failed. Please try again later.')).toBeTruthy();
    expect(await profilePage.getPasskeyCount()).toBe(1);

    await networkBlocker.appendFinish();
    await page.reload();
    expect(await profilePage.awaitState(ProfileStatus.ListWithPasskeys)).toBeTruthy();
    await profilePage.deletePasskeyByIndex(0, true);
    expect(await profilePage.awaitState(ProfileStatus.ListEmpty)).toBeTruthy();
    await profilePage.appendPasskey();
    expect(await profilePage.awaitErrorMessage('Passkey creation failed. Please try again later.')).toBeTruthy();
    expect(await profilePage.awaitState(ProfileStatus.ListEmpty)).toBeTruthy();

    await networkBlocker.manageDelete();
    await page.reload();
    expect(await profilePage.awaitState(ProfileStatus.ListEmpty)).toBeTruthy();
    await profilePage.appendPasskey();
    expect(await profilePage.awaitState(ProfileStatus.ListWithPasskeys)).toBeTruthy();
    await profilePage.deletePasskeyByIndex(0, true);
    expect(await profilePage.awaitErrorMessage('Passkey deletion failed. Please try again later.')).toBeTruthy();
  });
});
