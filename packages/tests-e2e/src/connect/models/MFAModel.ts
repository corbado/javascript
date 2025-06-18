import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

import type { AppendModel } from './AppendModel';

export class MFAModel {
  page: Page;
  append: AppendModel;
  timestamp: number;

  constructor(page: Page, append: AppendModel) {
    this.page = page;
    this.append = append;
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

  submit(invited: boolean, autoAppend: boolean) {
    if (invited) {
      const operationTrigger = () => this.page.getByRole('button', { name: 'Submit' }).click();
      return this.append.autoAppendPasskey(autoAppend, operationTrigger);
    } else {
      return this.page.getByRole('button', { name: 'Submit' }).click();
    }
  }
}
