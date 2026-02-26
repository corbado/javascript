import type { Page } from '@playwright/test';

export class PasskeyVerifyBlockModel {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  resetToLoginStart() {
    return this.page.getByAltText('edit-icon').click();
  }

  continueWithEmail() {
    return this.page.getByRole('button', { name: 'Continue with email' }).click();
  }

  retryPasskeyFromSoft() {
    return this.page.getByRole('button', { name: 'Login with passkey' }).click();
  }

  retryPasskeyFromHard() {
    return this.page.getByRole('button', { name: 'Try again' }).click();
  }
}
