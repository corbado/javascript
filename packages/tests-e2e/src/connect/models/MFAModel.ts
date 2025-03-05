import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class MFAModel {
  page: Page;
  timestamp: number;

  constructor(page: Page) {
    this.page = page;
    this.timestamp = Date.now();
  }

  registerTokenUsed() {
    this.timestamp = Date.now();
  }

  async autofillTOTP() {
    await this.page.waitForTimeout(31000 - (Date.now() - this.timestamp));
    await this.page.getByRole('button', { name: 'Autofill TOTP' }).click();
    await expect(this.page.getByPlaceholder('TOTP')).toHaveValue(/.+/);
    this.registerTokenUsed();
  }

  submit() {
    return this.page.getByRole('button', { name: 'Submit' }).click();
  }
}
