import type { CDPSession } from '@playwright/test';

import type { CDPSessionManager } from './CDPSessionManager';

export class NetworkRequestBlocker {
  #cdpClient: CDPSession;

  constructor(cdpManager: CDPSessionManager) {
    this.#cdpClient = cdpManager.getClient();
  }

  enableBlocking() {
    return this.#cdpClient.send('Network.enable');
  }

  blockCorbadoFAPI() {
    return this.#cdpClient.send('Network.setBlockedURLs', {
      urls: ['*.frontendapi.cloud.corbado-staging.io/v2/connect'],
    });
  }

  blockCorbadoFAPIFinishEndpoint() {
    return this.#cdpClient.send('Network.setBlockedURLs', {
      urls: ['*.frontendapi.cloud.corbado-staging.io/v2/connect/*/finish'],
    });
  }

  blockCorbadoConnectTokenEndpoint() {
    // This is sufficient, as the connectTokens endpoint is called from /passkey-list handler
    return this.#cdpClient.send('Network.setBlockedURLs', {
      urls: ['*.playground.corbado.io/passkey-list'],
    });
  }
}
