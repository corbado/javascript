import type { CDPSession, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { OtpType, ScreenNames } from '../utils/constants';
import { addWebAuthn, fillOtpCode, initializeCDPSession, removeWebAuthn } from '../utils/helperFunctions';
import UserManager from '../utils/UserManager';

export class UILoginFlow {
  readonly page: Page;
  #cdpClient: CDPSession | null = null;
  #authenticatorId = '';

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/auth');
    // Note: The page will make an API call to fetch project config after navigation
  }

  async removeWebAuthn() {
    if (this.#cdpClient) {
      await removeWebAuthn(this.#cdpClient, this.#authenticatorId);
    }
  }

  async fillOTP(otpType: OtpType = OtpType.Correct) {
    await fillOtpCode(this.page, otpType);
  }

  async navigateToStartPage(passkeySupported: boolean, webauthnSuccessful: boolean) {
    if (passkeySupported) {
      this.#cdpClient = await initializeCDPSession(this.page);
      this.#authenticatorId = await addWebAuthn(this.#cdpClient, webauthnSuccessful);
      // Corbado backend checks for passkey availability upon page load, so reloading the page prevents race condition
      await this.page.reload();
    }

    await this.page.getByText('Log in').click();
    await this.checkLandedOnScreen(ScreenNames.Start);
  }

  async createAccount(passkeySupported: boolean, registerPasskey = true): Promise<[name: string, email: string]> {
    if (passkeySupported) {
      this.#cdpClient = await initializeCDPSession(this.page);
      this.#authenticatorId = await addWebAuthn(this.#cdpClient, true);
      // Corbado backend checks for passkey availability upon page load, so reloading the page prevents race condition
      await this.page.reload();
    }

    const name = UserManager.getUserForSignup();
    const email = `${name}@corbado.com`;

    await this.page.getByPlaceholder('Name').click();
    await this.page.getByPlaceholder('Name').fill(name);
    await expect(this.page.getByPlaceholder('Name')).toHaveValue(name);

    await this.page.getByPlaceholder('Email address').click();
    await this.page.getByPlaceholder('Email address').fill(email);
    await expect(this.page.getByPlaceholder('Email address')).toHaveValue(email);

    await this.page.getByRole('button', { name: 'Continue' }).click();

    if (passkeySupported) {
      await this.checkLandedOnScreen(ScreenNames.PasskeyCreate);

      if (registerPasskey) {
        await this.page.getByRole('button', { name: 'Create your account' }).click();
        await this.checkLandedOnScreen(ScreenNames.PasskeySuccess);
      } else {
        await this.page.getByRole('button', { name: 'Send email one-time passcode' }).click();
        await this.checkLandedOnScreen(ScreenNames.EnterOtp);
      }
    } else {
      await this.checkLandedOnScreen(ScreenNames.EnterOtp);
    }

    await this.page.goto('/auth');

    return [name, email];
  }

  async checkLandedOnScreen(screenName: ScreenNames) {
    switch (screenName) {
      case ScreenNames.Start:
        await expect(this.page.getByRole('heading', { level: 1 })).toHaveText('Welcome back!');
        break;
      case ScreenNames.EnterOtp:
        await expect(this.page.getByRole('heading', { level: 1 })).toHaveText(
          'Enter one-time passcode to create account',
        );
        break;
      case ScreenNames.PasskeyBenefits:
        await expect(this.page.getByRole('heading', { level: 1 })).toHaveText('Passkeys');
        break;
      case ScreenNames.PasskeyAppend:
        await expect(this.page.getByRole('heading', { level: 1 })).toContainText('Log in even faster with');
        break;
      case ScreenNames.PasskeySuccess:
        await expect(this.page.getByRole('heading', { level: 1 }).first()).toContainText('Welcome!');
        break;
      case ScreenNames.End:
        await expect(this.page).toHaveURL('/');
        break;
    }
  }
}
