import type { Page } from '@playwright/test';

import type { AppendModel } from './AppendModel';

export class SignupModel {
  page: Page;
  append: AppendModel;

  constructor(page: Page, append: AppendModel) {
    this.page = page;
    this.append = append;
  }

  async autofillCredentials(): Promise<string> {
    await this.page.getByRole('button', { name: 'auto' }).click();
    return await this.page.getByPlaceholder('Email').inputValue();
  }

  submit(invited: boolean, autoAppend: boolean) {
    if (invited) {
      const operationTrigger = () => this.page.getByRole('button', { name: 'Sign up' }).click();
      return this.append.autoAppendPasskey(autoAppend, operationTrigger);
    } else {
      return this.page.getByRole('button', { name: 'Sign up' }).click();
    }
  }
}
