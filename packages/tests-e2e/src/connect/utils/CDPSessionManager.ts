import type { CDPSession, Page } from '@playwright/test';

export class CDPSessionManager {
  #cdpClient: CDPSession | null = null;

  async initialize(page: Page) {
    this.#cdpClient = await page.context().newCDPSession(page);
  }

  getClient(): CDPSession {
    if (!this.#cdpClient) {
      throw new Error('CDP client not initialized');
    }
    return this.#cdpClient;
  }
}
