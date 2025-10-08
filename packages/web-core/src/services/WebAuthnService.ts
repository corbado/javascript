/// <reference types="web-bluetooth" />
/// <reference types="user-agent-data-types" /> <- add this line
import type { ClientCapabilities } from '@corbado/types';
import { create, get } from '@corbado/webauthn-json';
import { createResponseToJSON, getResponseToJSON } from '@corbado/webauthn-json/extended';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { detectIncognito } from 'detectincognitojs';
import log from 'loglevel';
import type { Result } from 'ts-results';
import { Err, Ok } from 'ts-results';

import type { ClientInformation, ClientStateMeta, JavaScriptHighEntropy } from '../api/v2';
import { ConnectError, ConnectErrorType, CorbadoError } from '../utils';
import type { ClientStateEntry } from './ClientStateService';
import { ClientStateService } from './ClientStateService';

export type ResponseWithMessage = {
  response: string;
  message?: string;
};

/**
 * AuthenticatorService handles all interactions with webAuthn platform authenticators.
 * Currently, this includes the creation of passkeys and the login with existing passkeys.
 */
export class WebAuthnService {
  #abortController: AbortController | undefined;
  #visitorId: string | undefined;

  async createPasskey(serializedChallenge: string): Promise<Result<string, CorbadoError>> {
    try {
      const res = await this.createPasskeyRaw(serializedChallenge, false);
      return Ok(res.response);
    } catch (e) {
      if (e instanceof DOMException) {
        return Err(CorbadoError.fromDOMException(e));
      } else {
        return Err(CorbadoError.fromUnknownFrontendError(e));
      }
    }
  }

  async createPasskeyRaw(attestationOptions: string, conditional: boolean): Promise<ResponseWithMessage> {
    const abortController = this.abortOngoingOperation();
    const attestationOptionsJSON = JSON.parse(attestationOptions);
    this.#abortController = abortController;

    if (!PublicKeyCredential.parseCreationOptionsFromJSON) {
      attestationOptionsJSON.signal = abortController.signal;
      const signedChallenge = await create(attestationOptionsJSON);
      return {
        response: JSON.stringify(signedChallenge),
        message: 'parseCreationOptionsFromJSON not available',
      };
    }

    const publicKey = PublicKeyCredential.parseCreationOptionsFromJSON(attestationOptionsJSON.publicKey);
    let credential: PublicKeyCredential;
    if (conditional) {
      const result = await WebAuthnService.raceWithTimeout(
        navigator.credentials.create({
          publicKey,
          signal: abortController.signal,
          mediation: 'conditional',
        } as never),
        5000,
      );

      credential = result as PublicKeyCredential;
    } else {
      credential = (await navigator.credentials.create({
        publicKey,
        signal: abortController.signal,
      } as never)) as PublicKeyCredential;
    }

    try {
      return {
        response: JSON.stringify(credential.toJSON()),
        message: '',
      };
    } catch (e) {
      return {
        response: JSON.stringify(createResponseToJSON(credential)),
        message: 'toJSON() not available on PublicKeyCredential',
      };
    }
  }

  async login(
    serializedChallenge: string,
    conditional: boolean,
    onConditionalLoginStart?: (ac: AbortController) => void,
  ): Promise<Result<string, CorbadoError>> {
    try {
      const res = await this.loginRaw(serializedChallenge, conditional, onConditionalLoginStart);
      return Ok(res.response);
    } catch (e) {
      if (e instanceof DOMException) {
        return Err(CorbadoError.fromDOMException(e));
      } else {
        return Err(CorbadoError.fromUnknownFrontendError(e));
      }
    }
  }

  async loginRaw(
    assertionOptions: string,
    conditional: boolean,
    onConditionalLoginStart?: (ac: AbortController) => void,
  ): Promise<ResponseWithMessage> {
    const abortController = this.abortOngoingOperation();
    const assertionOptionsJSON = JSON.parse(assertionOptions);
    this.#abortController = abortController;
    onConditionalLoginStart?.(abortController);
    if (!PublicKeyCredential.parseRequestOptionsFromJSON) {
      const signedChallenge = await get(assertionOptionsJSON);
      return {
        response: JSON.stringify(signedChallenge),
        message: 'parseRequestOptionsFromJSON not available',
      };
    }

    const publicKey = PublicKeyCredential.parseRequestOptionsFromJSON(assertionOptionsJSON.publicKey);
    let mediation: CredentialMediationRequirement | undefined;
    if (conditional) {
      mediation = 'conditional';
    }

    const credential = (await navigator.credentials.get({
      publicKey,
      mediation,
      signal: abortController.signal,
    })) as PublicKeyCredential;

    try {
      return {
        response: JSON.stringify(credential.toJSON()),
        message: '',
      };
    } catch (e) {
      return {
        response: JSON.stringify(getResponseToJSON(credential)),
        message: 'toJSON() not available on PublicKeyCredential',
      };
    }
  }

  async getClientInformation(maybeClientHandle: ClientStateEntry<string> | undefined): Promise<ClientInformation> {
    const bluetoothAvailable = await WebAuthnService.canUseBluetooth();
    const isUserVerifyingPlatformAuthenticatorAvailable = await WebAuthnService.doesBrowserSupportPasskeys();
    const javaScriptHighEntropy = await WebAuthnService.getHighEntropyValues();
    const canUseConditionalUI = await WebAuthnService.doesBrowserSupportConditionalUI();

    // iOS & macOS Only so far
    const clientCapabilities = await WebAuthnService.getClientCapabilities();

    let currentVisitorId = this.#visitorId;

    if (!currentVisitorId) {
      const fpJS = await FingerprintJS.load();
      const { visitorId } = await fpJS.get();

      currentVisitorId = visitorId;
      this.#visitorId = visitorId;
    }

    let clientEnvHandleMeta: ClientStateMeta | undefined = undefined;
    if (maybeClientHandle) {
      clientEnvHandleMeta = {
        source: ClientStateService.parseClientStateSource(maybeClientHandle.source),
        ts: maybeClientHandle.ts,
      };
    }

    return {
      bluetoothAvailable: bluetoothAvailable,
      isUserVerifyingPlatformAuthenticatorAvailable: isUserVerifyingPlatformAuthenticatorAvailable,
      isConditionalMediationAvailable: canUseConditionalUI,
      clientEnvHandle: maybeClientHandle?.data,
      visitorId: currentVisitorId,
      javaScriptHighEntropy: javaScriptHighEntropy,
      clientCapabilities,
      webdriver: WebAuthnService.getWebdriver(),
      privateMode: await WebAuthnService.isPrivateMode(),
      clientEnvHandleMeta: clientEnvHandleMeta,
    };
  }

  static async doesBrowserSupportPasskeys(): Promise<boolean | undefined> {
    if (!PublicKeyCredential) {
      return undefined;
    }

    try {
      return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch (e) {
      log.debug('Error checking passkey availability', e);
      return;
    }
  }

  static async doesBrowserSupportConditionalUI(): Promise<boolean | undefined> {
    if (!PublicKeyCredential) {
      return undefined;
    }

    try {
      return await PublicKeyCredential.isConditionalMediationAvailable();
    } catch (e) {
      log.debug('Error checking conditional UI availability', e);
      return;
    }
  }

  static async isPrivateMode(): Promise<boolean | undefined> {
    try {
      const res = await detectIncognito();
      return res.isPrivate;
    } catch (e) {
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

  static getWebdriver(): boolean {
    try {
      return navigator.webdriver;
    } catch (e) {
      return false;
    }
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

  public abortOngoingOperation(): AbortController {
    if (this.#abortController) {
      this.#abortController.abort();
    }

    return new AbortController();
  }

  static async getClientCapabilities(): Promise<ClientCapabilities | undefined> {
    if (!PublicKeyCredential) {
      log.debug('PublicKeyCredential is not supported on this browser');
      return;
    }

    try {
      // We will ignore the type check as getClientCapabilities does not exist in the stable authn version and types
      // @ts-ignore
      return await PublicKeyCredential.getClientCapabilities();
    } catch (e) {
      log.debug('Error using getClientCapabilities: ', e);
      return;
    }
  }

  static challengeFromAttestationOptions(attestationOptions: string): string {
    const typed = JSON.parse(attestationOptions);
    return typed.publicKey.challenge;
  }

  static challengeFromAssertionOptions(assertionOptions: string): string | undefined {
    const typed = JSON.parse(assertionOptions);
    return typed.publicKey?.challenge;
  }

  static async signalAllAcceptedCredentials(rpId: string, userId: string, credentialIds: string[]): Promise<void> {
    // @ts-ignore
    if (!PublicKeyCredential || !PublicKeyCredential.signalAllAcceptedCredentials) {
      return undefined;
    }

    try {
      // @ts-ignore
      const p1 = PublicKeyCredential.signalAllAcceptedCredentials({
        rpId: rpId,
        userId: userId,
        allAcceptedCredentialIds: credentialIds,
      });

      await WebAuthnService.raceWithTimeout(p1, 2000);
    } catch (e) {
      log.debug('Error calling signalAllAcceptedCredentials', e);
      return;
    }
  }

  static async signalUnknownCredential(rpId: string, credentialId: string): Promise<void> {
    // @ts-ignore
    if (!PublicKeyCredential || !PublicKeyCredential.signalUnknownCredential) {
      return undefined;
    }

    try {
      // @ts-ignore
      await PublicKeyCredential.signalUnknownCredential({
        rpId: rpId,
        credentialId: credentialId,
      });
    } catch (e) {
      log.debug('Error calling signalUnknownCredential', e);
      return;
    }
  }

  static async raceWithTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new ConnectError(ConnectErrorType.RaceTimeout, `timeout of ${ms}ms reached`)), ms),
    );

    return Promise.race<T>([p, timeout]);
  }
}
