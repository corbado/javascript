import type { Page } from '@playwright/test';

export class SignupModel {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async autofillCredentials(): Promise<string> {
    await this.page.getByRole('button', { name: 'auto' }).click();
    return await this.page.getByPlaceholder('Email').inputValue();
  }

  submit(): Promise<void> {
    return this.page.getByRole('button', { name: 'Sign up' }).click();
  }
}
