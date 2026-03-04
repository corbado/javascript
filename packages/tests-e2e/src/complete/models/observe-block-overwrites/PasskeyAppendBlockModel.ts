import type { Page } from '@playwright/test';

export class PasskeyAppendBlockModel {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  navigateToLogin() {
    return this.page.getByRole('button', { name: 'Log in' }).click();
  }

  async startManualPasskeyAppend() {
    await this.page.getByRole('button', { name: 'Create account' }).click();
  }

  skip() {
    return this.page.getByRole('button', { name: 'Maybe later' }).click();
  }

  navigateFallbackEmail() {
    return this.page.getByRole('button', { name: 'Email verification' }).click();
  }

  navigateFallbackPhone() {
    return this.page.getByRole('button', { name: 'Phone verification' }).click();
  }
}
