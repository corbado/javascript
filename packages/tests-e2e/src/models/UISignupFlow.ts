import type { Page, CDPSession } from '@playwright/test';
import { expect } from '@playwright/test';

import { addWebAuthn, fillOtpCode, initializeCDPSession, removeWebAuthn } from '../utils/helperFunctions';
import UserManager from '../utils/UserManager';

export class UISignupFlow {
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

  async fillOTP(incomplete: boolean = false, incorrect: boolean = false) {
    await fillOtpCode(this.page, incomplete, incorrect);
  }

  async navigateToPasskeySignupPage(webauthnSuccessful: boolean) {
    this.#cdpClient = await initializeCDPSession(this.page);
    this.#authenticatorId = await addWebAuthn(this.#cdpClient, webauthnSuccessful);
    // Corbado backend checks for passkey availability upon page load, so reloading the page prevents race condition
    this.page.reload();

    const name = UserManager.getUserForSignup();
    const email = `${name}@corbado.com`;

    await this.page.getByPlaceholder('Name').click();
    await this.page.getByPlaceholder('Name').fill(name);
    await expect(this.page.getByPlaceholder('Name')).toHaveValue(name);

    await this.page.getByPlaceholder('Email address').click();
    await this.page.getByPlaceholder('Email address').fill(email);
    await expect(this.page.getByPlaceholder('Email address')).toHaveValue(email);

    await this.page.getByRole('button', { name: 'Continue' }).click();
    await this.checkLandedOnPage('PasskeySignup');
  }

  async navigateToPasskeyBenefitsPage(webauthnSuccessful: boolean) {
    this.navigateToPasskeySignupPage(webauthnSuccessful);

    await this.page.getByText('Passkeys').click();
    await this.checkLandedOnPage('PasskeyBenefits');
  }

  async navigateToEmailOTPPage(passkeySupported: boolean, webauthnSuccessful: boolean) {
    if (passkeySupported) {
      this.navigateToPasskeySignupPage(webauthnSuccessful);

      await this.page.getByRole('button', { name: 'Send email one-time passcode' }).click();
      await this.checkLandedOnPage('EmailOTP');
    } else {
      const name = UserManager.getUserForSignup();
      const email = `${name}@corbado.com`;

      await this.page.getByPlaceholder('Name').click();
      await this.page.getByPlaceholder('Name').fill(name);
      await expect(this.page.getByPlaceholder('Name')).toHaveValue(name);

      await this.page.getByPlaceholder('Email address').click();
      await this.page.getByPlaceholder('Email address').fill(email);
      await expect(this.page.getByPlaceholder('Email address')).toHaveValue(email);

      await this.page.getByRole('button', { name: 'Continue' }).click();
      await this.checkLandedOnPage('EmailOTP');
    }
  }

  async navigateToPasskeyAppendPage(webauthnSuccessful: boolean) {
    await this.navigateToPasskeySignupPage(webauthnSuccessful);

    await this.page.getByRole('button', { name: 'Send email one-time passcode' }).click();
    await this.checkLandedOnPage('EmailOTP');

    await this.fillOTP();
    await this.checkLandedOnPage('PasskeyAppend');
  }

  async createAccount(
    passkeySupported: boolean,
    webauthnSuccessful: boolean = true,
  ): Promise<[name: string, email: string]> {
    if (passkeySupported) {
      this.#cdpClient = await initializeCDPSession(this.page);
      this.#authenticatorId = await addWebAuthn(this.#cdpClient, webauthnSuccessful);
      // Corbado backend checks for passkey availability upon page load, so reloading the page prevents race condition
      this.page.reload();
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

    return [name, email];
  }

  async createDummyAccount(): Promise<[name: string, email: string]> {
    const [name, email] = await this.createAccount(false);
    await this.checkLandedOnPage('EmailOTP');

    await this.page.getByRole('button', { name: 'Cancel' }).click();
    await this.checkLandedOnPage('InitiateSignup');

    return [name, email];
  }

  async checkLandedOnPage(pageName: string) {
    switch (pageName) {
      case 'InitiateSignup':
        await expect(this.page.getByRole('heading', { level: 1 })).toHaveText('Create your account');
        break;
      case 'EmailOTP':
        await expect(this.page.getByRole('heading', { level: 1 })).toHaveText(
          'Enter one-time passcode to create account',
        );
        break;
      case 'PasskeySignup':
        await expect(this.page.getByRole('heading', { level: 1 })).toContainText("Let's get you set up with");
        break;
      case 'PasskeyBenefits':
        await expect(this.page.getByRole('heading', { level: 1 })).toHaveText('Passkeys');
        break;
      case 'PasskeyAppend':
        await expect(this.page.getByRole('heading', { level: 1 })).toContainText('Log in even faster with');
        break;
      case 'PasskeyWelcome':
        await expect(this.page.getByRole('heading', { level: 1 }).first()).toContainText('Welcome!');
        break;
      case 'LoggedIn':
        await expect(this.page).toHaveURL('/');
        break;
    }
  }
}
