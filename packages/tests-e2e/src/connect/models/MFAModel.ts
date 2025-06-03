import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { ScreenNames } from '../utils/Constants';
import { expectScreen } from '../utils/ExpectScreen';
import type { VirtualAuthenticator } from '../utils/VirtualAuthenticator';

export class MFAModel {
  page: Page;
  authenticator: VirtualAuthenticator;
  timestamp: number;

  constructor(page: Page, authenticator: VirtualAuthenticator) {
    this.page = page;
    this.authenticator = authenticator;
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

  autoAppendPasskey(complete: boolean) {
    const operationTrigger = () => this.page.getByRole('button', { name: 'Submit' }).click();
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
