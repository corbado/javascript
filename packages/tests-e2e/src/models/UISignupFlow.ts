import type { CDPSession, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { OtpType, ScreenNames } from '../utils/constants';
import { addWebAuthn, fillOtpCode, initializeCDPSession, removeWebAuthn } from '../utils/helperFunctions';
import { loadAuth } from '../utils/helperFunctions/loadAuth';
import { setWebAuthnAutomaticPresenceSimulation } from '../utils/helperFunctions/setWebAuthnAutomaticPresenceSimulation';
import { setWebAuthnUserVerified } from '../utils/helperFunctions/setWebAuthnUserVerified';
import UserManager from '../utils/UserManager';

export class UISignupFlow {
  readonly page: Page;
  #cdpClient: CDPSession | null = null;
  #authenticatorId = '';

  constructor(page: Page) {
    this.page = page;
  }

  // must be called after every update to WebAuthn
  // because Corbado checks for WebAuthn support on page load
  async loadAuth() {
    await loadAuth(this.page);
  }

  async initializeCDPSession() {
    this.#cdpClient = await initializeCDPSession(this.page);
  }

  async addWebAuthn(successful: boolean) {
    if (this.#cdpClient) {
      this.#authenticatorId = await addWebAuthn(this.#cdpClient, successful);
    }
  }

  async setWebAuthnUserVerified(successful: boolean) {
    if (this.#cdpClient) {
      await setWebAuthnUserVerified(this.#cdpClient, this.#authenticatorId, successful);
    }
  }

  async removeWebAuthn() {
    if (this.#cdpClient) {
      await removeWebAuthn(this.#cdpClient, this.#authenticatorId);
    }
  }

  async inputPasskey(check: () => Promise<void>) {
    if (this.#cdpClient) {
      // const credentialAddedPromise = new Promise<void>((resolve) => {
      //   this.#cdpClient?.on('WebAuthn.credentialAdded', payload => {
      //     console.log(payload);
      //     resolve();
      //   });
      // });
      await setWebAuthnAutomaticPresenceSimulation(this.#cdpClient, this.#authenticatorId, true);
      // await credentialAddedPromise;
      await check();
      await setWebAuthnAutomaticPresenceSimulation(this.#cdpClient, this.#authenticatorId, false);
    }
  }

  async fillOTP(otpType: OtpType) {
    await fillOtpCode(this.page, otpType);
  }

  async fillIdentifiers(fillUsername: boolean, fillEmail: boolean, fillPhone: boolean) {
    const username = UserManager.getUserForSignup();
    let email,
      phone = undefined;
    if (fillUsername) {
      await this.page.getByRole('textbox', { name: 'username' }).click();
      await this.page.getByRole('textbox', { name: 'username' }).fill(username.replace('+', '-'));
      await expect(this.page.getByRole('textbox', { name: 'username' })).toHaveValue(username.replace('+', '-'));
    }
    if (fillEmail) {
      email = `${username}@corbado.com`;

      await this.page.getByRole('textbox', { name: 'email' }).click();
      await this.page.getByRole('textbox', { name: 'email' }).fill(email);
      await expect(this.page.getByRole('textbox', { name: 'email' })).toHaveValue(email);
    }
    if (fillPhone) {
      phone = `+1650555${username.slice(-4)}`;

      await this.page.getByRole('textbox', { name: 'phone' }).click();
      await this.page.getByRole('textbox', { name: 'phone' }).fill(phone);
      await expect(this.page.getByRole('textbox', { name: 'phone' })).toHaveValue(phone);
    }

    return [username, email, phone];
  }

  // helper function for checking duplicate identifiers in InitSignup screen robustness tests
  // assumes config for B1.3, passkey unsupported device
  async createAccount() {
    const [username, email, phone] = await this.fillIdentifiers(true, true, true);
    await this.page.getByRole('button', { name: 'Continue' }).click();

    await this.checkLandedOnScreen(ScreenNames.EmailOtp, email);
    await this.fillOTP(OtpType.Email);
    await this.checkLandedOnScreen(ScreenNames.PhoneOtp, undefined, phone);
    await this.fillOTP(OtpType.Sms);

    await this.checkLandedOnScreen(ScreenNames.End);

    await this.page.getByRole('button', { name: 'Logout' }).click();
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

    await this.page.getByRole('button', { name: 'Create account' }).click();
    await this.inputPasskey(async () => {
      await this.checkLandedOnScreen(ScreenNames.PasskeyError);
    });

    return [username, email, phone];
  }

  // helper function for robustness tests in EmailOtpScreen-robustness.spec.ts
  // assumes config for B1.3, passkey unsupported device
  async navigateToEmailOtpScreen() {
    const [username, email, phone] = await this.fillIdentifiers(true, true, true);
    await this.page.getByRole('button', { name: 'Continue' }).click();

    await this.checkLandedOnScreen(ScreenNames.EmailOtp, email);

    return [username, email, phone];
  }

  async checkPasskeyRegistered() {
    await expect(this.page.locator('.cb-passkey-list-card')).toHaveCount(1);
  }

  async checkNoPasskeyRegistered() {
    // await expect(this.page.getByText("You don't have any passkeys yet.")).toHaveCount(1);
  }

  async checkLandedOnScreen(screenName: ScreenNames, email?: string, phone?: string) {
    switch (screenName) {
      case ScreenNames.InitSignup:
        await expect(this.page.getByText('Create your account')).toBeVisible();
        break;
      case ScreenNames.InitLogin:
        await expect(this.page.getByText('Log In')).toBeVisible();
        break;
      case ScreenNames.PasskeyAppend1:
        await expect(this.page.getByText('Create account with passkeys')).toBeVisible();
        break;
      case ScreenNames.PasskeyAppend2:
        await expect(this.page.getByText('Set up passkey for easier login')).toBeVisible();
        break;
      case ScreenNames.PasskeyAppended:
        await expect(this.page.getByText('Success!')).toBeVisible();
        break;
      case ScreenNames.PasskeyError:
        await expect(this.page.getByText('Something went wrong...')).toBeVisible();
        break;
      case ScreenNames.EmailOtp:
        if (!email) {
          throw new Error('checkLandedOnScreen: Email is required');
        }
        await expect(this.page.getByText('Enter code to create account')).toBeVisible();
        await expect(this.page.getByText(email)).toBeVisible();
        break;
      case ScreenNames.EmailEdit:
        await expect(this.page.getByText('Type new email address')).toBeVisible();
        break;
      case ScreenNames.PhoneOtp:
        if (!phone) {
          throw new Error('checkLandedOnScreen: Phone is required');
        }
        await expect(this.page.getByText('Enter code to create account')).toBeVisible();
        await expect(this.page.getByText(phone)).toBeVisible();
        break;
      case ScreenNames.PhoneEdit:
        await expect(this.page.getByText('Type new phone number')).toBeVisible();
        break;
      case ScreenNames.End:
        await expect(this.page).toHaveURL(/\/pro-[0-9]+/);
        break;
    }
  }
}
