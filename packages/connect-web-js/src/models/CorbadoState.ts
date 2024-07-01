import { CorbadoConnectConfig } from '@corbado/types';
import { ConnectService } from '@corbado/web-core';

export class CorbadoState {
  #connectService: ConnectService;
  #connectConfig: CorbadoConnectConfig;

  constructor(connectConfig: CorbadoConnectConfig) {
    this.#connectService = new ConnectService(
      connectConfig.projectId,
      connectConfig.frontendApiUrlSuffix ?? 'frontendapi.corbado.io',
      connectConfig.isDebug ?? false,
    );

    this.#connectConfig = connectConfig;
  }

  get connectService() {
    return this.#connectService;
  }

  get connectConfig() {
    return this.#connectConfig;
  }

  dispose() {
    return this.#connectService.dispose();
  }
}
