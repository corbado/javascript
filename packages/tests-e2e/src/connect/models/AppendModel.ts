import type { Page } from '@playwright/test';

import type { VirtualAuthenticator } from '../utils/VirtualAuthenticator';

export class AppendModel {
  page: Page;
  authenticator: VirtualAuthenticator;

  constructor(page: Page, authenticator: VirtualAuthenticator) {
    this.page = page;
    this.authenticator = authenticator;
  }

  async appendPasskey(): Promise<void> {
    const operationTrigger = () => this.page.getByRole('button', { name: 'Continue' }).click();
    await this.authenticator.startAndCompletePasskeyOperation(operationTrigger);
  }

  confirmAppended(): Promise<void> {
    return this.page.getByRole('button', { name: 'Continue' }).click();
  }

  skipAppend(): Promise<void> {
    return this.page.locator('.cb-append-skip').click();
  }
}
