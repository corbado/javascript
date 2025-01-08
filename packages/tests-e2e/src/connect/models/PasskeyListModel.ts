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

  async deletePasskey(index: number): Promise<void> {
    await this.page.locator('.cb-passkey-list-item-delete-icon').nth(index).click();
    await this.page.getByRole('button', { name: 'Delete' }).click();
  }

  appendPasskey(complete: boolean): Promise<void> {
    const operationTrigger: () => Promise<void> = (): Promise<void> =>
      this.page.getByRole('button', { name: 'Add a passkey' }).click();
    if (complete) {
      return this.authenticator.startAndCompletePasskeyOperation(operationTrigger);
    } else {
      return this.authenticator.startAndCancelPasskeyOperation(
        operationTrigger,
        (): Promise<void> =>
          expect(this.page.locator('.cb-notification-text')).toHaveText(
            'You have cancelled setting up your passkey. Please try again.',
          ),
      );
    }
  }
}
