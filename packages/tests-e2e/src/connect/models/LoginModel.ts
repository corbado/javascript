import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { ScreenNames } from '../utils/Constants';
import { expectScreen } from '../utils/ExpectScreen';
import type { VirtualAuthenticator } from '../utils/VirtualAuthenticator';

export class LoginModel {
  page: Page;
  authenticator: VirtualAuthenticator;

  constructor(page: Page, authenticator: VirtualAuthenticator) {
    this.page = page;
    this.authenticator = authenticator;
  }

  submitPasskeyButton(complete: boolean) {
    const operationTrigger = () => this.page.locator('.cb-passkey-button').click();
    if (complete) {
      return this.authenticator.startAndCompletePasskeyOperation(operationTrigger);
    } else {
      return this.authenticator.startAndCancelPasskeyOperation(operationTrigger, () =>
        expectScreen(this.page, ScreenNames.PasskeyError1),
      );
    }
  }

  removePasskeyButton() {
    return this.page.locator('.cb-switch').click();
  }

  async repeatedlyFailPasskeyInput() {
    const operationTrigger1 = () => this.page.getByRole('button', { name: 'Continue' }).click();
    await this.authenticator.startAndCancelPasskeyOperation(operationTrigger1, () =>
      expectScreen(this.page, ScreenNames.PasskeyError2),
    );

    const operationTrigger2 = () => this.page.getByRole('button', { name: 'Try again' }).click();
    await this.authenticator.startAndCancelPasskeyOperation(operationTrigger2, () => this.page.waitForTimeout(100));
    await this.authenticator.startAndCancelPasskeyOperation(operationTrigger2, () => this.page.waitForTimeout(100));
    await this.authenticator.startAndCancelPasskeyOperation(operationTrigger2, () =>
      expectScreen(this.page, ScreenNames.InitLoginFallback),
    );
  }

  async submitEmail(email: string, withPasskey: boolean) {
    await this.page.getByLabel('Email address').fill(email);
    if (withPasskey) {
      const operationTrigger = () => this.page.getByRole('button', { name: 'Login' }).click();
      await this.authenticator.startAndCompletePasskeyOperation(operationTrigger);
    } else {
      await this.page.getByRole('button', { name: 'Login' }).click();
    }
  }

  async submitFallbackCredentials(email: string, password: string, emailAutofilled = false) {
    if (emailAutofilled) {
      await expect(this.page.getByPlaceholder('Email')).toHaveValue(email);
    } else {
      await this.page.getByPlaceholder('Email').fill(email);
    }
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }
}
