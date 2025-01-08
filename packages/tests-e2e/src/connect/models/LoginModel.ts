import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

import type { VirtualAuthenticator } from '../utils/VirtualAuthenticator';

export class LoginModel {
  page: Page;
  authenticator: VirtualAuthenticator;

  constructor(page: Page, authenticator: VirtualAuthenticator) {
    this.page = page;
    this.authenticator = authenticator;
  }

  submitPasskeyButton(): Promise<void> {
    const operationTrigger = () => this.page.locator('.cb-passkey-button').click();
    return this.authenticator.startAndCompletePasskeyOperation(operationTrigger);
  }

  removePasskeyButton(): Promise<void> {
    return this.page.locator('.cb-switch').click();
  }

  async submitEmail(email: string, withPasskey: boolean): Promise<void> {
    await this.page.getByLabel('Email address').fill(email);
    if (withPasskey) {
      const operationTrigger = () => this.page.getByRole('button', { name: 'Login' }).click();
      await this.authenticator.startAndCompletePasskeyOperation(operationTrigger);
    } else {
      await this.page.getByRole('button', { name: 'Login' }).click();
    }
  }

  async submitFallbackCredentials(email: string, password: string, emailAutofilled = false): Promise<void> {
    if (emailAutofilled) {
      await expect(this.page.getByPlaceholder('Email')).toHaveValue(email);
    } else {
      await this.page.getByPlaceholder('Email').fill(email);
    }
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }
}
