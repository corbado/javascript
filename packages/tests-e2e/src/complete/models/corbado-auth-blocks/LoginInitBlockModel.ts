import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

import type { SocialProviderType } from '../../utils/constants';
import { socialLogin } from '../../utils/externalauth';

export class LoginInitBlockModel {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToSignup() {
    await this.page.getByRole('button', { name: 'Sign up' }).click();
  }

  async fillEmailUsername(value: string) {
    const elem = this.page.locator('.cb-container').getByRole('textbox').first();
    await elem.click();
    await elem.fill(value);
  }

  async fillPhone(value: string) {
    const elem = this.page.getByRole('textbox', { name: 'phone' });
    await elem.click();
    await elem.fill(value);
  }

  switchToInputEmailUsername() {
    return this.page.getByRole('button', { name: 'Use email' }).click();
  }

  switchToInputPhone() {
    return this.page.getByRole('button', { name: 'Use phone' }).click();
  }

  async submitPrimary() {
    await this.page.getByRole('button', { name: 'Continue', exact: true }).click();
  }

  async submitSocialGoogle(email: string, password: string, secret: string) {
    await socialLogin(this.page, email, password, secret);
  }

  submitSocialLocal() {
    return this.page.getByRole('button', { name: /custom/i }).click();
  }

  submitPasskeyButton() {
    return this.page.locator('.cb-last-identifier').click();
  }

  async removePasskeyButton() {
    await this.page.getByRole('button', { name: 'Switch account' }).click();
  }

  expectTextError(value: string) {
    return expect(this.page.getByText(value)).toBeVisible();
  }

  expectPasskeyButton(exists: boolean) {
    if (exists) {
      return expect(this.page.getByText('Login with Passkey')).toBeVisible();
    } else {
      return expect(this.page.getByRole('textbox', { name: 'email' })).toBeVisible();
    }
  }

  async expectSocialButton(...type: SocialProviderType[]) {
    for (const t of type) {
      await expect(this.page.getByRole('button', { name: `Continue with ${t}` })).toBeVisible();
    }
  }
}
