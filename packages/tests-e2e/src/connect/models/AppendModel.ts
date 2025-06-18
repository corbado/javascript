import type { Page } from '@playwright/test';

import { ErrorTexts, ScreenNames } from '../utils/Constants';
import { expectError, expectScreen } from '../utils/ExpectScreen';
import type { VirtualAuthenticator } from '../utils/VirtualAuthenticator';

export class AppendModel {
  page: Page;
  authenticator: VirtualAuthenticator;

  constructor(page: Page, authenticator: VirtualAuthenticator) {
    this.page = page;
    this.authenticator = authenticator;
  }

  appendPasskey(complete: boolean) {
    const operationTrigger = () => this.page.getByRole('button', { name: 'Continue' }).click();
    if (complete) {
      return this.authenticator.startAndCompletePasskeyOperation(operationTrigger);
    } else {
      return this.authenticator.startAndCancelPasskeyOperation(operationTrigger, () =>
        expectError(this.page, ErrorTexts.CancelledPasskey),
      );
    }
  }

  autoAppendPasskey(complete: boolean, operationTrigger: () => Promise<void>) {
    if (complete) {
      return this.authenticator.startAndCompletePasskeyOperation(operationTrigger);
    } else {
      return this.authenticator.startAndCancelPasskeyOperation(operationTrigger, async () => {
        await expectScreen(this.page, ScreenNames.PasskeyAppend);
        await this.page.waitForSelector('.button-loading-container', { state: 'detached' });
      });
    }
  }

  confirmAppended() {
    return this.page.getByRole('button', { name: 'Continue' }).click();
  }

  skipAppend() {
    return this.page.locator('.cb-append-skip').click();
  }
}
