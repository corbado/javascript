/// <reference types="web-bluetooth" />
/// <reference types="user-agent-data-types" /> <- add this line
import type { CredentialRequestOptionsJSON } from '@github/webauthn-json';
import { create, get } from '@github/webauthn-json';
import log from 'loglevel';
import type { Result } from 'ts-results';
import { Err, Ok } from 'ts-results';

import type { JavaScriptHighEntropy } from '../api/v2';
import { CorbadoError } from '../utils';
const clientHandleKey = 'cbo_client_handle';

/**
 * AuthenticatorService handles all interactions with webAuthn platform authenticators.
 * Currently, this includes the creation of passkeys and the login with existing passkeys.
 */
export class WebAuthnService {
  #abortController: AbortController | undefined;

  async createPasskey(serializedChallenge: string): Promise<Result<string, CorbadoError>> {
    try {
      const abortController = this.abortOngoingOperation();
      const challenge = JSON.parse(serializedChallenge);
      challenge.signal = abortController.signal;
      this.#abortController = abortController;

      const signedChallenge = await create(challenge);
      const serializedResponse = JSON.stringify(signedChallenge);

      return Ok(serializedResponse);
    } catch (e) {
      if (e instanceof DOMException) {
        return Err(CorbadoError.fromDOMException(e));
      } else {
        return Err(CorbadoError.fromUnknownFrontendError(e));
      }
    }
  }

  async login(
    serializedChallenge: string,
    conditional: boolean,
    skipIfOnlyHybrid = false,
  ): Promise<Result<string, CorbadoError>> {
    try {
      const abortController = this.abortOngoingOperation();
      const challenge: CredentialRequestOptionsJSON = JSON.parse(serializedChallenge);

      if (skipIfOnlyHybrid) {
        const hasOtherTypesOfPasskeys = challenge.publicKey?.allowCredentials?.some(
          credential =>
            credential.transports && credential.transports.some(transportType => transportType !== 'hybrid'),
        );

        if (!hasOtherTypesOfPasskeys) {
          return Err(CorbadoError.onlyHybridPasskeyAvailable());
        }
      }

      challenge.signal = abortController.signal;
      this.#abortController = abortController;

      if (conditional) {
        challenge.mediation = 'conditional';
      }

      const signedChallenge = await get(challenge);
      const serializedResponse = JSON.stringify(signedChallenge);

      return Ok(serializedResponse);
    } catch (e) {
      if (e instanceof DOMException) {
        return Err(CorbadoError.fromDOMException(e));
      } else {
        return Err(CorbadoError.fromUnknownFrontendError(e));
      }
    }
  }

  static async doesBrowserSupportPasskeys(): Promise<boolean> {
    return (
      window.PublicKeyCredential && (await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable())
    );
  }

  static async doesBrowserSupportConditionalUI(): Promise<boolean> {
    return window.PublicKeyCredential && (await window.PublicKeyCredential.isConditionalMediationAvailable());
  }

  static async canUseBluetooth(): Promise<boolean> {
    try {
      const availability = await navigator.bluetooth.getAvailability();
      if (availability) {
        return true;
      }

      return false;
    } catch (e) {
      log.debug('Error checking bluetooth availability', e);
      return false;
    }
  }

  static getClientHandle(): string | null {
    return localStorage.getItem(clientHandleKey);
  }

  static async getHighEntropyValues(): Promise<JavaScriptHighEntropy | undefined> {
    try {
      if (!navigator.userAgentData) {
        return;
      }

      const ua = await navigator.userAgentData.getHighEntropyValues(['platformVersion']);
      const platform = ua.platform;
      const mobile = ua.mobile;
      const platformVersion = ua.platformVersion;

      if (!platform || mobile === undefined || !platformVersion) {
        return;
      }

      return {
        platform,
        mobile,
        platformVersion,
      };
    } catch (e) {
      return;
    }
  }

  static setClientHandle(clientHandle: string) {
    localStorage.setItem(clientHandleKey, clientHandle);
  }

  public abortOngoingOperation(): AbortController {
    if (this.#abortController) {
      this.#abortController.abort();
    }

    return new AbortController();
  }
}
