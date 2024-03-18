import type { CDPSession, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { IdentifierType, IdentifierVerification } from '../utils/constants';
import { OtpType, ScreenNames } from '../utils/constants';
import { addWebAuthn, fillOtpCode, initializeCDPSession, removeWebAuthn } from '../utils/helperFunctions';
import { loadAuth } from '../utils/helperFunctions/loadAuth';
import { setWebAuthnAutomaticPresenceSimulation } from '../utils/helperFunctions/setWebAuthnAutomaticPresenceSimulation';
import { setWebAuthnUserVerified } from '../utils/helperFunctions/setWebAuthnUserVerified';
import UserManager from '../utils/UserManager';

export class UILoginFlow {
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
      // const credentialAssertedPromise = new Promise<void>((resolve) => {
      //   this.#cdpClient?.on('WebAuthn.credentialAsserted', payload => {
      //     console.log(payload);
      //     resolve();
      //   });
      // });
      await setWebAuthnAutomaticPresenceSimulation(this.#cdpClient, this.#authenticatorId, true);
      // await credentialAssertedPromise;
      await check();
      await setWebAuthnAutomaticPresenceSimulation(this.#cdpClient, this.#authenticatorId, false);
    }
  }

  async fillOTP(otpType: OtpType) {
    await fillOtpCode(this.page, otpType);
  }

  async createAccount(
    enabled: IdentifierType[],
    verifications: IdentifierVerification[],
    passkeySupported: boolean,
    registerPasskey: boolean,
  ) {
    const id = UserManager.getUserForSignup();
    let username, email, phone = undefined;

    if (enabled.includes(IdentifierType.Username)) {
      username = id.replace('+', '-');
      await this.page.getByRole('textbox', { name: 'username' }).click();
      await this.page.getByRole('textbox', { name: 'username' }).fill(username);
      await expect(this.page.getByRole('textbox', { name: 'username' })).toHaveValue(username);
    }
    if (enabled.includes(IdentifierType.Email)) {
      email = `${id}@corbado.com`;
      await this.page.getByRole('textbox', { name: 'email' }).click();
      await this.page.getByRole('textbox', { name: 'email' }).fill(email);
      await expect(this.page.getByRole('textbox', { name: 'email' })).toHaveValue(email);
    }
    if (enabled.includes(IdentifierType.Phone)) {
      phone = `+1650555${id.slice(-4)}`;
      await this.page.getByRole('textbox', { name: 'phone' }).click();
      await this.page.getByRole('textbox', { name: 'phone' }).fill(phone);
      await expect(this.page.getByRole('textbox', { name: 'phone' })).toHaveValue(phone);
    }
    await this.page.getByRole('button', { name: 'Continue' }).click();

    if (passkeySupported) {
      await this.checkLandedOnScreen(ScreenNames.PasskeyAppend1);

      if (registerPasskey) {
        await this.page.getByRole('button', { name: 'Create account' }).click();
        await this.inputPasskey(async () => {
          await this.checkLandedOnScreen(ScreenNames.PasskeyAppended);
        });
        await this.page.getByRole('button', { name: 'Continue' }).click();
      } else {
        if (verifications.includes(IdentifierVerification.EmailOtp) || verifications.includes(IdentifierVerification.EmailLink)) {
          await this.page.getByText('Email verification').click();
        } else if (verifications.includes(IdentifierVerification.PhoneOtp)) {
          await this.page.getByText('Phone verification').click();
        }
      }
    }

    if (verifications.includes(IdentifierVerification.EmailOtp)) {
      await this.checkLandedOnScreen(ScreenNames.EmailOtpSignup, email);
      await this.fillOTP(OtpType.Email);
    } else if (verifications.includes(IdentifierVerification.EmailLink)) {
      throw new Error('createAccount: Email link test code not yet implemented')
    }
    if (verifications.includes(IdentifierVerification.PhoneOtp)) {
      await this.checkLandedOnScreen(ScreenNames.PhoneOtpSignup, undefined, phone);
      await this.fillOTP(OtpType.Phone);
    }

    if (passkeySupported && !registerPasskey) {
      await this.checkLandedOnScreen(ScreenNames.PasskeyAppend2);
      await this.page.getByText('Maybe later').click();
    }

    await this.checkLandedOnScreen(ScreenNames.End);
    if (registerPasskey) {
      await this.checkPasskeyRegistered();
    }
    await this.page.getByRole('button', { name: 'Logout' }).click();

    await loadAuth(this.page);

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
      case ScreenNames.EmailOtpSignup:
        if (!email) {
          throw new Error('checkLandedOnScreen: Email is required');
        }
        await expect(this.page.getByText('Enter code to create account')).toBeVisible();
        await expect(this.page.getByText(email)).toBeVisible();
        break;
      case ScreenNames.EmailOtpLogin:
        if (!email) {
          throw new Error('checkLandedOnScreen: Email is required');
        }
        await expect(this.page.getByText('Enter code to log in')).toBeVisible();
        await expect(this.page.getByText(email)).toBeVisible();
        break;
      case ScreenNames.EmailEdit:
        await expect(this.page.getByText('Type new email address')).toBeVisible();
        break;
      case ScreenNames.PhoneOtpSignup:
        if (!phone) {
          throw new Error('checkLandedOnScreen: Phone is required');
        }
        await expect(this.page.getByText('Enter code to create account')).toBeVisible();
        await expect(this.page.getByText(phone)).toBeVisible();
        break;
      case ScreenNames.PhoneOtpLogin:
        if (!phone) {
          throw new Error('checkLandedOnScreen: Phone is required');
        }
        await expect(this.page.getByText('Enter code to log in')).toBeVisible();
        await expect(this.page.getByText(phone)).toBeVisible();
        break;
      case ScreenNames.PhoneEdit:
        await expect(this.page.getByText('Type new phone number')).toBeVisible();
        break;
      case ScreenNames.PasskeyBackground:
        await expect(this.page.getByText('Passkey login in process...')).toBeVisible();
        break;
      case ScreenNames.End:
        await expect(this.page).toHaveURL(/\/pro-[0-9]+$/);
        break;
    }
  }
}
