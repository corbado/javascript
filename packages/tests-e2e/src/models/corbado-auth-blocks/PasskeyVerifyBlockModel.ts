import type { Page } from '@playwright/test';

import type { VirtualAuthenticator } from '../utils/VirtualAuthenticator';

export class PasskeyVerifyBlockModel {
  page: Page;
  virtualAuthenticator: VirtualAuthenticator;

  constructor(page: Page, virtualAuthenticator: VirtualAuthenticator) {
    this.page = page;
    this.virtualAuthenticator = virtualAuthenticator;
  }

  async performAutomaticPasskeyVerification(operationTrigger: () => Promise<void>) {
    await this.virtualAuthenticator.startAndCompletePasskeyOperation(operationTrigger);
  }

  async retryPasskey() {
    await this.virtualAuthenticator.startAndCompletePasskeyOperation(() =>
      this.page.getByRole('button', { name: 'Create account' }).click(),
    );
  }
}
