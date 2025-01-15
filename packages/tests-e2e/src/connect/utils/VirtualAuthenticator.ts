import type { CDPSession } from '@playwright/test';

import type { CDPSessionManager } from './CDPSessionManager';
import { operationTimeout } from './Constants';

export class VirtualAuthenticator {
  #cdpClient: CDPSession;
  #authenticatorId = '';

  constructor(cdpManager: CDPSessionManager) {
    this.#cdpClient = cdpManager.getClient();
  }

  async addWebAuthn(passkeySupported = true) {
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

  removeWebAuthn() {
    return this.#cdpClient.send('WebAuthn.removeVirtualAuthenticator', {
      authenticatorId: this.#authenticatorId,
    });
  }

  async startAndCompletePasskeyOperation(
    operationTrigger: () => Promise<void>,
    postOperationCheck: (() => Promise<void>) | null = null,
  ) {
    let postOperationPromise: Promise<void>;
    if (postOperationCheck === null) {
      postOperationPromise = new Promise<void>(resolve => {
        this.#cdpClient?.on('WebAuthn.credentialAdded', () => resolve());
        this.#cdpClient?.on('WebAuthn.credentialAsserted', () => resolve());
      });
    } else {
      postOperationPromise = postOperationCheck();
    }

    const wait = new Promise<void>(resolve => setTimeout(resolve, operationTimeout));
    await this.#setWebAuthnUserVerified(this.#authenticatorId, true);
    await this.#setWebAuthnAutomaticPresenceSimulation(this.#authenticatorId, true);

    await operationTrigger();

    await Promise.race([postOperationPromise, wait.then(() => Promise.reject('Passkey input timeout'))]);
    await this.#setWebAuthnAutomaticPresenceSimulation(this.#authenticatorId, false);
  }

  async startAndCancelPasskeyOperation(operationTrigger: () => Promise<void>, postOperationCheck: () => Promise<void>) {
    await this.#setWebAuthnUserVerified(this.#authenticatorId, false);
    await this.#setWebAuthnAutomaticPresenceSimulation(this.#authenticatorId, true);

    await operationTrigger();

    await postOperationCheck();
    await this.#setWebAuthnAutomaticPresenceSimulation(this.#authenticatorId, false);
  }

  clearCredentials() {
    return this.#cdpClient.send('WebAuthn.clearCredentials', {
      authenticatorId: this.#authenticatorId,
    });
  }

  async addDummyCredential() {
    try {
      await this.#cdpClient.send('WebAuthn.addCredential', {
        authenticatorId: this.#authenticatorId,
        credential: {
          credentialId: 'WZuSfPDeCfXUMqO3vcVZ6ZYY0w2W4NpLcLzTjMl4qns=',
          isResidentCredential: true,
          rpId: 'connect-next.playground.corbado.io',
          privateKey:
            'MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgz/eSahk8R0fk3Jjpcbd1LPc2gGKyzEG23UFIbFTqSbyhRANCAAQ4a8dJ559cf0cZcg0U7k5oCofmtOzuqXDSwzP8LLhv0InronrySiaWAGuWFpVsbNyOnWSd6VZJU8wiFKSMiDWN',
          userHandle: 'TDBlaFVpNnRNQg==',
          signCount: 1,
        },
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  #setWebAuthnAutomaticPresenceSimulation(authenticatorId: string, automatic: boolean) {
    return this.#cdpClient.send('WebAuthn.setAutomaticPresenceSimulation', {
      authenticatorId: authenticatorId,
      enabled: automatic,
    });
  }

  #setWebAuthnUserVerified(authenticatorId: string, isUserVerified: boolean) {
    return this.#cdpClient.send('WebAuthn.setUserVerified', {
      authenticatorId,
      isUserVerified,
    });
  }
}
