import type { Page } from '@playwright/test';

import { ScreenNames } from '../../utils/constants';
import type { VirtualAuthenticator } from '../utils/VirtualAuthenticator';
import { expectScreen } from './expectScreen';

export class PasskeyAppendBlockModel {
  page: Page;
  virtualAuthenticator: VirtualAuthenticator;

  constructor(page: Page, virtualAuthenticator: VirtualAuthenticator) {
    this.page = page;
    this.virtualAuthenticator = virtualAuthenticator;
  }

  navigateToLogin() {
    return this.page.getByRole('button', { name: 'Log in' }).click();
  }

  fillFullName(value: string) {
    return;
  }

  async startPasskeyOperation(complete: boolean) {
    const operationTrigger = () => this.page.getByRole('button', { name: 'Create account' }).click();
    if (complete) {
      await this.virtualAuthenticator.startAndCompletePasskeyOperation(operationTrigger);
    } else {
      await this.virtualAuthenticator.startAndCancelPasskeyOperation(operationTrigger, () =>
        expectScreen(this.page, ScreenNames.PasskeyError),
      );
    }
  }

  async retryPasskeyOperation(complete: boolean) {
    const operationTrigger = () => this.page.getByRole('button', { name: 'Try again' }).click();
    if (complete) {
      await this.virtualAuthenticator.startAndCompletePasskeyOperation(operationTrigger);
    } else {
      await this.virtualAuthenticator.startAndCancelPasskeyOperation(operationTrigger, () =>
        expectScreen(this.page, ScreenNames.PasskeyError),
      );
    }
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
