import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

import type { VirtualAuthenticator } from '../utils/VirtualAuthenticator';

export class PasskeyListModel {
  page: Page;
  authenticator: VirtualAuthenticator;

  constructor(page: Page, authenticator: VirtualAuthenticator) {
    this.page = page;
    this.authenticator = authenticator;
  }

  expectPasskeys(n: number) {
    return expect(this.page.locator('.cb-passkey-list-item')).toHaveCount(n);
  }

  async deletePasskey(index: number) {
    await this.page.locator('.cb-passkey-list-item-delete-icon').nth(index).click();
    await this.page.getByRole('button', { name: 'Delete' }).click();
  }

  async appendPasskey(complete: boolean) {
    const operationTrigger = () => this.page.getByRole('button', { name: 'Add a passkey' }).click();
    if (complete) {
      await this.authenticator.startAndCompletePasskeyOperation(operationTrigger);
    } else {
      await this.authenticator.startAndCancelPasskeyOperation(operationTrigger, () =>
        expect(this.page.locator('.cb-notification-text')).toHaveText(
          'You have cancelled setting up your passkey. Please try again.',
        ),
      );
    }
  }
}
