import type { CDPSession, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { OtpType, ScreenNames } from '../utils/constants';
import { fillOtpCode, removeWebAuthn } from '../utils/helperFunctions';
import { enableVirtualAuthenticator } from '../utils/helperFunctions/enableVirtualAuthenticator';
import { gotoAuth } from '../utils/helperFunctions/gotoAuth';
import UserManager from '../utils/UserManager';

export class UILoginFlow {
  readonly page: Page;
  #cdpClient: CDPSession | null = null;
  #authenticatorId = '';

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await gotoAuth(this.page);
  }

  async removeWebAuthn() {
    if (this.#cdpClient) {
      await removeWebAuthn(this.#cdpClient, this.#authenticatorId);
    }
  }

  async fillOTP(otpType: OtpType = OtpType.Correct) {
    await fillOtpCode(this.page, otpType);
  }

  async navigateToStartScreen(passkeySupported: boolean, webauthnSuccessful = true) {
    if (passkeySupported) {
      [this.#cdpClient, this.#authenticatorId] = await enableVirtualAuthenticator(this.page, webauthnSuccessful);
    }

    await this.page.getByText('Log in').click();
    await this.checkLandedOnScreen(ScreenNames.Start);
  }

  async navigateToPasskeyAppendScreen(email: string, webauthnSuccessful = true) {
    await this.navigateToStartScreen(true, webauthnSuccessful);

    await this.page.getByPlaceholder('Email address').click();
    await this.page.getByPlaceholder('Email address').fill(email);
    await expect(this.page.getByPlaceholder('Email address')).toHaveValue(email);

    await this.page.getByRole('button', { name: 'Continue' }).click();
    await this.checkLandedOnScreen(ScreenNames.EnterOtp);

    await this.fillOTP();
    await this.checkLandedOnScreen(ScreenNames.PasskeyAppend);
  }

  async navigateToPasskeyBenefitsScreen(email: string, webauthnSuccessful = true) {
    await this.navigateToPasskeyAppendScreen(email, webauthnSuccessful);

    await this.page.getByText('Passkeys').click();
    await this.checkLandedOnScreen(ScreenNames.PasskeyBenefits);
  }

  async navigateToEnterOtpScreen(email: string, passkeySupported: boolean, webauthnSuccessful = true) {
    await this.navigateToStartScreen(passkeySupported, webauthnSuccessful);

    await this.page.getByPlaceholder('Email address').click();
    await this.page.getByPlaceholder('Email address').fill(email);
    await expect(this.page.getByPlaceholder('Email address')).toHaveValue(email);

    await this.page.getByRole('button', { name: 'Continue' }).click();
    await this.checkLandedOnScreen(ScreenNames.EnterOtp);
  }

  async createAccount(passkeySupported: boolean, registerPasskey = true): Promise<[name: string, email: string]> {
    if (passkeySupported) {
      [this.#cdpClient, this.#authenticatorId] = await enableVirtualAuthenticator(this.page, true);
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

    await gotoAuth(this.page);

    return [name, email];
  }

  async checkLandedOnScreen(screenName: ScreenNames) {
    switch (screenName) {
      case ScreenNames.Start:
        await expect(this.page.getByRole('heading', { level: 1 })).toHaveText('Welcome back!');
        break;
      case ScreenNames.EnterOtp:
        await expect(this.page.getByRole('heading', { level: 1 })).toContainText('Enter one-time passcode to');
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
