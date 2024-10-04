/// <reference types="web-bluetooth" />
/// <reference types="user-agent-data-types" /> <- add this line
import type { ClientCapabilities } from '@corbado/types';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import type { CredentialRequestOptionsJSON } from '@github/webauthn-json';
import { create, get } from '@github/webauthn-json';
import log from 'loglevel';
import type { Result } from 'ts-results';
import { Err, Ok } from 'ts-results';

import type { ClientInformation, JavaScriptHighEntropy } from '../api/v2';
import { CorbadoError } from '../utils';

const clientHandleKey = 'cbo_client_handle';

/**
 * AuthenticatorService handles all interactions with webAuthn platform authenticators.
 * Currently, this includes the creation of passkeys and the login with existing passkeys.
 */
export class WebAuthnService {
  #abortController: AbortController | undefined;
  #visitorId: string | undefined;

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
    onConditionalLoginStart?: (ac: AbortController) => void,
  ): Promise<Result<string, CorbadoError>> {
    try {
      const abortController = this.abortOngoingOperation();

      const challenge: CredentialRequestOptionsJSON = JSON.parse(serializedChallenge);

      challenge.signal = abortController.signal;
      this.#abortController = abortController;
      onConditionalLoginStart?.(abortController);

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

  async getClientInformation(): Promise<ClientInformation> {
    const bluetoothAvailable = await WebAuthnService.canUseBluetooth();
    const isUserVerifyingPlatformAuthenticatorAvailable = await WebAuthnService.doesBrowserSupportPasskeys();
    const javaScriptHighEntropy = await WebAuthnService.getHighEntropyValues();
    const canUseConditionalUI = await WebAuthnService.doesBrowserSupportConditionalUI();
    const maybeClientHandle = WebAuthnService.getClientHandle();

    // iOS & macOS Only so far
    const clientCapabilities = await WebAuthnService.getClientCapabilities();

    let currentVisitorId = this.#visitorId;

    if (!currentVisitorId) {
      const fpJS = await FingerprintJS.load();
      const { visitorId } = await fpJS.get();

      currentVisitorId = visitorId;
      this.#visitorId = visitorId;
    }

    return {
      bluetoothAvailable: bluetoothAvailable,
      isUserVerifyingPlatformAuthenticatorAvailable: isUserVerifyingPlatformAuthenticatorAvailable,
      isConditionalMediationAvailable: canUseConditionalUI,
      clientEnvHandle: maybeClientHandle ?? undefined,
      visitorId: currentVisitorId,
      javaScriptHighEntropy: javaScriptHighEntropy,
      clientCapabilities,
    };
  }

  static async doesBrowserSupportPasskeys(): Promise<boolean | undefined> {
    if (!window.PublicKeyCredential) {
      return undefined;
    }

    try {
      return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch (e) {
      log.debug('Error checking passkey availability', e);
      return;
    }
  }

  static async doesBrowserSupportConditionalUI(): Promise<boolean | undefined> {
    if (!window.PublicKeyCredential) {
      return undefined;
    }

    try {
      return await window.PublicKeyCredential.isConditionalMediationAvailable();
    } catch (e) {
      log.debug('Error checking conditional UI availability', e);
      return;
    }
  }

  static async canUseBluetooth(): Promise<boolean | undefined> {
    try {
      return await navigator.bluetooth.getAvailability();
    } catch (e) {
      // When using Safari and Firefox navigator.bluetooth returns undefined => we will return undefined
      log.debug('Error checking bluetooth availability', e);
      return;
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

  static async getClientCapabilities(): Promise<ClientCapabilities | undefined> {
    if (!window.PublicKeyCredential) {
      log.debug('PublicKeyCredential is not supported on this browser');
      return;
    }

    try {
      // We will ignore the type check as getClientCapabilities does not exist in the stable authn version and types
      // @ts-ignore
      return await window.PublicKeyCredential.getClientCapabilities();
    } catch (e) {
      log.debug('Error using getClientCapabilities: ', e);
      return;
    }
  }
}
