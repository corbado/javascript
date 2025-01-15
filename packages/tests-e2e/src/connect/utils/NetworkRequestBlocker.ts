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

  blockCorbadoCDN() {
    return this.#cdpClient.send('Network.setBlockedURLs', {
      urls: ['cdn.vr.corbado-staging.io/*'],
    });
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

  blockCorbadoBAPI() {
    return this.#cdpClient.send('Network.setBlockedURLs', {
      urls: ['api.cloud.corbado-staging.io'],
    });
  }

  blockCorbadoConnectTokenEndpoint() {
    return this.#cdpClient.send('Network.setBlockedURLs', {
      urls: ['vrdemo.vr.corbado-staging.io/corbadoTokens'],
    });
  }
}
