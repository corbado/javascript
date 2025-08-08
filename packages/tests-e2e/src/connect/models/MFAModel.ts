import type { Page } from '@playwright/test';

import type { AppendModel } from './AppendModel';

export class MFAModel {
  page: Page;
  append: AppendModel;
  timestamp?: number;

  constructor(page: Page, append: AppendModel) {
    this.page = page;
    this.append = append;
  }

  registerTokenUsed() {
    this.timestamp = Date.now();
  }

  async autofillTOTP() {
    if (this.timestamp) {
      await this.page.waitForTimeout(31000 - (Date.now() - this.timestamp));
    }

    await this.page.getByRole('button', { name: 'Autofill' }).click();
    this.registerTokenUsed();
  }

  submit(invited: boolean, autoAppend: boolean) {
    return this.page.getByRole('button', { name: 'Submit' }).click();
  }
}
