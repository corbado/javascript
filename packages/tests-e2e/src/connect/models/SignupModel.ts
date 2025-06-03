import type { Page } from '@playwright/test';

import type { VirtualAuthenticator } from '../utils/VirtualAuthenticator';
import { ScreenNames } from '../utils/Constants';
import { expectScreen } from '../utils/ExpectScreen';

export class SignupModel {
  page: Page;
  authenticator: VirtualAuthenticator;

  constructor(page: Page, authenticator: VirtualAuthenticator) {
    this.page = page;
    this.authenticator = authenticator;
  }

  async autofillCredentials(): Promise<string> {
    await this.page.getByRole('button', { name: 'auto' }).click();
    return await this.page.getByPlaceholder('Email').inputValue();
  }

  submit() {
    return this.page.getByRole('button', { name: 'Sign up' }).click();
  }

  autoAppendPasskey(complete: boolean) {
    const operationTrigger = () => this.page.getByRole('button', { name: 'Sign up' }).click();
    if (complete) {
      return this.authenticator.startAndCompletePasskeyOperation(operationTrigger);
    } else {
      return this.authenticator.startAndCancelPasskeyOperation(operationTrigger, async () => {
        await expectScreen(this.page, ScreenNames.PasskeyAppend);
        await this.page.waitForSelector('.button-loading-container', { state: 'detached' });
      });
    }
  }
}
