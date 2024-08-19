import type { BrowserContext, CDPSession, Page, TestInfo } from '@playwright/test';
import { expect } from '@playwright/test';

import { operationTimeout, OtpType, ScreenNames } from '../utils/constants';
import { addWebAuthn, fillOtpCode, initializeCDPSession, removeWebAuthn } from '../utils/helperFunctions';
import { getEmailLink } from '../utils/helperFunctions/getEmailLink';
import { loadAuth } from '../utils/helperFunctions/loadAuth';
import { setWebAuthnAutomaticPresenceSimulation } from '../utils/helperFunctions/setWebAuthnAutomaticPresenceSimulation';
import { setWebAuthnUserVerified } from '../utils/helperFunctions/setWebAuthnUserVerified';
import UserManager from '../utils/UserManager';

export class UISignupFlow {
  projectId = '';
  page: Page;

  #cdpClient: CDPSession | null = null;
  #authenticatorId = '';

  constructor(page: Page) {
    this.page = page;
  }

  // must be called after every update to WebAuthn
  // because Corbado checks for WebAuthn support on page load
  async loadAuth() {
    await loadAuth(this.page, this.projectId);
  }

  async printTestInfo(context: BrowserContext, testInfo: TestInfo) {
    const cboAuthProcessRaw = (await context.storageState()).origins
      .find(origin => origin.origin.replace(/\/$/, '') === process.env.PLAYWRIGHT_TEST_URL?.replace(/\/$/, ''))
      ?.localStorage.find(item => item.name === 'cbo_auth_process')?.value;
    let processId = '_';
    if (cboAuthProcessRaw) {
      const cboAuthProcess = JSON.parse(cboAuthProcessRaw);
      processId = cboAuthProcess.id;
    }
    console.log(testInfo.project.name, this.projectId, processId);
  }

  async initializeCDPSession() {
    this.#cdpClient = await initializeCDPSession(this.page);
  }

  async addWebAuthn(passkeySupported = true) {
    if (!this.#cdpClient) {
      throw new Error('CDP client not intialized');
    }
    this.#authenticatorId = await addWebAuthn(this.#cdpClient, passkeySupported);
  }

  async removeWebAuthn() {
    if (!this.#cdpClient) {
      throw new Error('CDP client not intialized');
    }
    await removeWebAuthn(this.#cdpClient, this.#authenticatorId);
  }

  async simulateSuccessfulPasskeyInput(operationTrigger: () => Promise<void>) {
    if (!this.#cdpClient) {
      throw new Error('CDP client not intialized');
    }
    const operationCompleted = new Promise<void>(resolve => {
      this.#cdpClient?.on('WebAuthn.credentialAdded', () => resolve());
      this.#cdpClient?.on('WebAuthn.credentialAsserted', () => resolve());
    });
    const wait = new Promise<void>(resolve => setTimeout(resolve, operationTimeout));
    await setWebAuthnUserVerified(this.#cdpClient, this.#authenticatorId, true);
    await setWebAuthnAutomaticPresenceSimulation(this.#cdpClient, this.#authenticatorId, true);
    await operationTrigger();
    await Promise.race([operationCompleted, wait.then(() => Promise.reject('Passkey input timeout'))]);
    await setWebAuthnAutomaticPresenceSimulation(this.#cdpClient, this.#authenticatorId, false);
  }

  async simulateFailedPasskeyInput(operationTrigger: () => Promise<void>, postOperationCheck: () => Promise<void>) {
    if (!this.#cdpClient) {
      throw new Error('CDP client not intialized');
    }
    await setWebAuthnUserVerified(this.#cdpClient, this.#authenticatorId, false);
    await setWebAuthnAutomaticPresenceSimulation(this.#cdpClient, this.#authenticatorId, true);
    await operationTrigger();
    await postOperationCheck();
    await setWebAuthnAutomaticPresenceSimulation(this.#cdpClient, this.#authenticatorId, false);
  }

  async fillOTP(otpType: OtpType) {
    await fillOtpCode(this.page, otpType);
  }

  async getEmailLink(context: BrowserContext, email: string, authType: number) {
    return await getEmailLink(this.projectId, context, email, authType);
  }

  async fillIdentifiers(fillUsername: boolean, fillEmail: boolean, fillPhone: boolean) {
    const id = UserManager.getUserForSignup();
    let username,
      email,
      phone = undefined;
    if (fillUsername) {
      username = id.replace('+', '-');

      await this.page.getByRole('textbox', { name: 'username' }).click();
      await this.page.getByRole('textbox', { name: 'username' }).fill(username);
      await expect(this.page.getByRole('textbox', { name: 'username' })).toHaveValue(username);
    }
    if (fillEmail) {
      email = `${id}@corbado.com`;

      await this.page.getByRole('textbox', { name: 'email' }).click();
      await this.page.getByRole('textbox', { name: 'email' }).fill(email);
      await expect(this.page.getByRole('textbox', { name: 'email' })).toHaveValue(email);
    }
    if (fillPhone) {
      phone = `+1650555${id.slice(-4)}`;

      await this.page.getByRole('textbox', { name: 'phone' }).click();
      await this.page.getByRole('textbox', { name: 'phone' }).fill(phone); // UI automatically removes +1 and sets country code to US
      await expect(this.page.getByRole('textbox', { name: 'phone' })).toHaveValue(
        new RegExp(`^(\\${phone.slice(0, 2)})?${phone.slice(2)}$`),
      ); // check if only the phone number remains in textbox (without country code)
    }

    return [username, email, phone];
  }

  // helper function for checking duplicate identifiers in InitSignup screen robustness tests
  // assumes config for B1.3, passkey unsupported device
  async createAccount() {
    const [username, email, phone] = await this.fillIdentifiers(true, true, true);
    await this.page.getByRole('button', { name: 'Continue' }).click();

    await this.checkLandedOnScreen(ScreenNames.EmailOtpSignup, email);
    await this.fillOTP(OtpType.Email);
    await this.checkLandedOnScreen(ScreenNames.PhoneOtpSignup, undefined, phone);
    await this.fillOTP(OtpType.Phone);

    await this.checkLandedOnScreen(ScreenNames.End);
    await this.checkNoPasskeyRegistered();

    await this.page.getByRole('button', { name: 'Logout' }).click();

    await this.loadAuth();
    await this.checkLandedOnScreen(ScreenNames.InitSignup);

    return [username ?? '', email ?? '', phone ?? ''];
  }

  // helper function for robustness tests in PasskeyAppendScreen-robustness.spec.ts
  // assumes config for B1.3, passkey supported device
  async navigateToPasskeyAppendScreen() {
    const [username, email, phone] = await this.fillIdentifiers(true, true, true);
    await this.page.getByRole('button', { name: 'Continue' }).click();

    await this.checkLandedOnScreen(ScreenNames.PasskeyAppend1);

    return [username, email, phone];
  }

  // helper function for robustness tests in PasskeyErrorScreen-robustness.spec.ts
  // assumes config for B1.3, passkey supported device
  // assumes userVerified set to false
  async navigateToPasskeyErrorScreen() {
    const [username, email, phone] = await this.navigateToPasskeyAppendScreen();

    await this.simulateFailedPasskeyInput(
      () => this.page.getByRole('button', { name: 'Create account' }).click(),
      () => this.checkLandedOnScreen(ScreenNames.PasskeyError),
    );

    return [username, email, phone];
  }

  // helper function for robustness tests in EmailOtpScreen-robustness.spec.ts
  // assumes config for B1.3, passkey unsupported device
  async navigateToEmailOtpScreen() {
    const [username, email, phone] = await this.fillIdentifiers(true, true, true);
    await this.page.getByRole('button', { name: 'Continue' }).click();

    await this.checkLandedOnScreen(ScreenNames.EmailOtpSignup, email);

    return [username, email, phone];
  }

  async checkPasskeyRegistered(count = 1) {
    await expect(this.page.locator('.cb-passkey-list-card')).toHaveCount(count);
  }

  async checkNoPasskeyRegistered() {
    await expect(this.page.locator('.cb-passkey-list-card')).toHaveCount(0);
    // await expect(this.page.getByText("You don't have any passkeys yet.")).toHaveCount(1);
  }

  async checkLandedOnScreen(screenName: ScreenNames, email?: string, phone?: string) {
    switch (screenName) {
      case ScreenNames.InitSignup:
        await expect(this.page.locator('.cb-header')).toHaveText('Create your account');
        break;
      case ScreenNames.InitLogin:
        await expect(this.page.locator('.cb-header')).toHaveText('Log in');
        break;
      case ScreenNames.PasskeyAppend1:
        await expect(this.page.locator('.cb-pk-append-header')).toHaveText('Create account with passkeys');
        break;
      case ScreenNames.PasskeyAppend2:
        await expect(this.page.locator('.cb-pk-append-header')).toHaveText('Set up passkey for easier login');
        break;
      case ScreenNames.PasskeyAppended:
        await expect(this.page.locator('.cb-header')).toHaveText('Success!');
        break;
      case ScreenNames.PasskeyError:
        await expect(this.page.locator('.cb-header')).toHaveText('Something went wrong...');
        break;
      case ScreenNames.EmailOtpSignup:
        if (!email) {
          throw new Error('checkLandedOnScreen: Email is required');
        }
        await expect(this.page.locator('.cb-header')).toHaveText('Enter code to create account');
        await expect(this.page.getByText(email)).toBeVisible();
        break;
      case ScreenNames.EmailLinkSentSignup:
        if (!email) {
          throw new Error('checkLandedOnScreen: Email is required');
        }
        await expect(this.page.locator('.cb-header')).toHaveText('Check your inbox to create your account');
        await expect(this.page.getByText(email)).toBeVisible();
        break;
      case ScreenNames.EmailLinkSuccessSignup:
        await expect(this.page.locator('.cb-header')).toHaveText('Successful email verification');
        break;
      case ScreenNames.EmailEdit:
        await expect(this.page.locator('.cb-header')).toHaveText('Type new email address');
        break;
      case ScreenNames.PhoneOtpSignup: {
        if (!phone) {
          throw new Error('checkLandedOnScreen: Phone is required');
        }
        await expect(this.page.locator('.cb-header')).toHaveText('Enter code to create account');
        const formattedPhone =
          phone.slice(0, 2) + ' ' + phone.slice(2, 5) + ' ' + phone.slice(5, 8) + ' ' + phone.slice(8);
        await expect(this.page.getByText(formattedPhone)).toBeVisible();
        break;
      }
      case ScreenNames.PhoneEdit:
        await expect(this.page.locator('.cb-header')).toHaveText('Type new phone number');
        break;
      case ScreenNames.End:
        await expect(this.page).toHaveURL(/\/pro-[0-9]+/);
        break;
      // case ScreenNames.AbortSignup:
      //   await expect(this.page.getByText('Abort Signup?')).toBeVisible();
      //   break;
    }
  }
}
