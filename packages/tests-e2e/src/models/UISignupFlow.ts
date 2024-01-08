import type { CDPSession } from '@playwright/test';
import { expect, type Page } from '@playwright/test';

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

  async initiateSignup() {
    const user = UserManager.getUserForSignup();

    await this.page.getByPlaceholder('Name').click();
    await this.page.getByPlaceholder('Name').fill(user);
    await expect(this.page.getByPlaceholder('Name')).toHaveValue(user);

    await this.page.getByPlaceholder('Email address').click();
    await this.page.getByPlaceholder('Email address').fill(`${user}@corbado.com`);
    await expect(this.page.getByPlaceholder('Email address')).toHaveValue(`${user}@corbado.com`);

    await this.page.getByRole('button', { name: 'Continue with email' }).click();
  }

  async initiateSignupWithWebAuthn() {
    const user = UserManager.getUserForSignup();
    this.#cdpClient = await initializeCDPSession(this.page);
    this.#authenticatorId = await addWebAuthn(this.#cdpClient);

    await this.page.getByPlaceholder('Name').click();
    await this.page.getByPlaceholder('Name').fill(user);
    await expect(this.page.getByPlaceholder('Name')).toHaveValue(user);

    await this.page.getByPlaceholder('Email address').click();
    await this.page.getByPlaceholder('Email address').fill(`${user}@corbado.com`);
    await expect(this.page.getByPlaceholder('Email address')).toHaveValue(`${user}@corbado.com`);

    await this.page.getByRole('button', { name: 'Continue with email' }).click();
  }

  async removeWebAuthn() {
    if (this.#cdpClient) {
      await removeWebAuthn(this.#cdpClient, this.#authenticatorId);
    }
  }

  async fillOTP() {
    await fillOtpCode(this.page);
  }

  async createPasskey() {
    await this.page.getByRole('button', { name: 'Create your account' }).click();
    await this.page.getByRole('button', { name: 'Continue' }).click();
  }

  async checkSignUpSuccess() {
    await expect(this.page).toHaveURL('/');
  }

  async checkLandedOnPage(pageName: string) {
    switch (pageName) {
      case "InitiateSignup":
        await expect(this.page.getByRole('heading', { level: 1 })).toHaveText('Create your account');
        break;
      case "EmailOTP":
        await expect(this.page.getByRole('heading', { level: 1 })).toHaveText('Enter code to create account');
        break;
    }
  }
}
