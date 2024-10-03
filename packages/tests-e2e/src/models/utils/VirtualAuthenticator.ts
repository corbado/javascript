import type { CDPSession, Page } from '@playwright/test';

import { operationTimeout } from '../../utils/constants';

export class VirtualAuthenticator {
  #cdpClient: CDPSession | null = null;
  #authenticatorId = '';

  async initializeCDPSession(page: Page) {
    console.log('setting up cdp client');
    this.#cdpClient = await page.context().newCDPSession(page);
  }

  async addWebAuthn(passkeySupported = true) {
    if (!this.#cdpClient) {
      throw new Error('CDP client not intialized');
    }

    await this.#cdpClient.send('WebAuthn.enable');
    const result = await this.#cdpClient.send('WebAuthn.addVirtualAuthenticator', {
      options: passkeySupported
        ? {
            protocol: 'ctap2',
            transport: 'internal',
            hasResidentKey: true,
            hasUserVerification: true,
            automaticPresenceSimulation: false,
          }
        : {
            protocol: 'u2f',
            transport: 'usb',
          },
    });

    this.#authenticatorId = result.authenticatorId;
  }

  async removeWebAuthn() {
    if (!this.#cdpClient) {
      throw new Error('CDP client not intialized');
    }

    await this.#cdpClient.send('WebAuthn.removeVirtualAuthenticator', {
      authenticatorId: this.#authenticatorId,
    });
  }

  async startAndCompletePasskeyOperation(operationTrigger: () => Promise<void>) {
    if (!this.#cdpClient) {
      throw new Error('CDP client not intialized');
    }

    const operationCompleted = new Promise<void>(resolve => {
      this.#cdpClient?.on('WebAuthn.credentialAdded', () => resolve());
      this.#cdpClient?.on('WebAuthn.credentialAsserted', () => resolve());
    });

    const wait = new Promise<void>(resolve => setTimeout(resolve, operationTimeout));
    await this.#setWebAuthnUserVerified(this.#cdpClient, this.#authenticatorId, true);
    await this.#setWebAuthnAutomaticPresenceSimulation(this.#cdpClient, this.#authenticatorId, true);

    await operationTrigger();

    await Promise.race([operationCompleted, wait.then(() => Promise.reject('Passkey input timeout'))]);
    await this.#setWebAuthnAutomaticPresenceSimulation(this.#cdpClient, this.#authenticatorId, false);
  }

  async startAndCancelPasskeyOperation(operationTrigger: () => Promise<void>, postOperationCheck: () => Promise<void>) {
    if (!this.#cdpClient) {
      throw new Error('CDP client not intialized');
    }

    await this.#setWebAuthnUserVerified(this.#cdpClient, this.#authenticatorId, false);
    await this.#setWebAuthnAutomaticPresenceSimulation(this.#cdpClient, this.#authenticatorId, true);

    await operationTrigger();

    await postOperationCheck();
    await this.#setWebAuthnAutomaticPresenceSimulation(this.#cdpClient, this.#authenticatorId, false);
  }

  #setWebAuthnAutomaticPresenceSimulation(client: CDPSession, authenticatorId: string, automatic: boolean) {
    return client.send('WebAuthn.setAutomaticPresenceSimulation', {
      authenticatorId: authenticatorId,
      enabled: automatic,
    });
  }

  #setWebAuthnUserVerified(client: CDPSession, authenticatorId: string, isUserVerified: boolean) {
    return client.send('WebAuthn.setUserVerified', {
      authenticatorId,
      isUserVerified,
    });
  }
}
