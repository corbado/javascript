export class NetworkRequestBlocker {
  #cdpClient: CDPSession;

  static async init(page: Page): Promise<NetworkRequestBlocker> {
    const blocker = new NetworkRequestBlocker();
    blocker.#cdpClient = await page.context().newCDPSession(page);
    await blocker.#cdpClient.send('Network.enable');

    return blocker;
  }

  loginInit() {
    return this.#setBlockedURLs(['*/v2/connect/login/init']);
  }

  loginStart() {
    return this.#setBlockedURLs(['*/v2/connect/login/start']);
  }

  loginFinish() {
    return this.#setBlockedURLs(['*/v2/connect/login/finish']);
  }

  appendInit() {
    return this.#setBlockedURLs(['*/v2/connect/append/init']);
  }

  appendStart() {
    return this.#setBlockedURLs(['*/v2/connect/append/start']);
  }

  appendFinish() {
    return this.#setBlockedURLs(['*/v2/connect/append/finish']);
  }

  manageInit() {
    return this.#setBlockedURLs(['*/v2/connect/manage/init']);
  }

  manageList() {
    return this.#setBlockedURLs(['*/v2/connect/manage/list']);
  }

  manageDelete() {
    return this.#setBlockedURLs(['*/v2/connect/manage/delete']);
  }

  blockCorbadoConnectTokenEndpoint(port: number) {
    // This is sufficient, as the connectTokens endpoint is called from /passkey-list handler
    return this.#cdpClient.send('Network.setBlockedURLs', {
      urls: [`localhost:${port.toString()}/passkey-list`],
    });
  }

  unblockAll() {
    return this.#setBlockedURLs([]);
  }

  #setBlockedURLs(urls: string[]) {
    return this.#cdpClient.send('Network.setBlockedURLs', { urls });
  }
}

import type { CDPSession, Page } from '@playwright/test';
