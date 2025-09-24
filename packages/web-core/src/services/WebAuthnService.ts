/// <reference types="web-bluetooth" />
/// <reference types="user-agent-data-types" /> <- add this line
import type { ClientCapabilities } from '@corbado/types';
import { parseCreationOptionsFromJSON, parseRequestOptionsFromJSON } from '@corbado/webauthn-json/browser-ponyfill';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { detectIncognito } from 'detectincognitojs';
import log from 'loglevel';
import type { Result } from 'ts-results';
import { Err, Ok } from 'ts-results';

import type { ClientInformation, ClientStateMeta, JavaScriptHighEntropy } from '../api/v2';
import { CorbadoError } from '../utils';
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
    let message;
    const abortController = this.abortOngoingOperation();
    const attestationOptionsJSON = JSON.parse(attestationOptions);
    this.#abortController = abortController;

    let publicKey: PublicKeyCredentialCreationOptions | undefined;
    if (PublicKeyCredential.parseCreationOptionsFromJSON) {
      publicKey = PublicKeyCredential.parseCreationOptionsFromJSON(attestationOptionsJSON.publicKey);
    } else {
      message = 'parseCreationOptionsFromJSON not available';
      publicKey = parseCreationOptionsFromJSON(attestationOptionsJSON).publicKey;
    }

    if (!publicKey) {
      throw new Error('No publicKey in assertionOptions');
    }

    let credential: PublicKeyCredential;
    if (conditional) {
      const p1 = await navigator.credentials.create({
        publicKey,
        signal: abortController.signal,
        mediation: 'conditional',
      } as never);
      const p2 = new Promise<null>(resolve => setTimeout(() => resolve(null), 5000));

      const result = await Promise.race([p1, p2]);
      if (!result) {
        throw new Error('Timeout after 5000ms');
      }

      credential = result as PublicKeyCredential;
    } else {
      credential = (await navigator.credentials.create({
        publicKey,
        signal: abortController.signal,
      } as never)) as PublicKeyCredential;
    }

    return {
      response: JSON.stringify(credential.toJSON()),
      message,
    };
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
    let message: string | undefined;
    const abortController = this.abortOngoingOperation();
    const assertionOptionsJSON = JSON.parse(assertionOptions);
    this.#abortController = abortController;
    onConditionalLoginStart?.(abortController);

    let publicKey: PublicKeyCredentialRequestOptions | undefined;
    if (PublicKeyCredential.parseRequestOptionsFromJSON) {
      publicKey = PublicKeyCredential.parseRequestOptionsFromJSON(assertionOptionsJSON.publicKey);
    } else {
      publicKey = parseRequestOptionsFromJSON(assertionOptionsJSON).publicKey;
      message = 'parseRequestOptionsFromJSON not available';
    }

    if (!publicKey) {
      throw new Error('No publicKey in assertionOptions');
    }

    let mediation: CredentialMediationRequirement | undefined;
    if (conditional) {
      mediation = 'conditional';
    }

    const credential = (await navigator.credentials.get({
      publicKey,
      mediation,
      signal: abortController.signal,
    })) as PublicKeyCredential;

    return {
      response: JSON.stringify(credential.toJSON()),
      message,
    };
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

      const p2 = new Promise((_, reject) => setTimeout(() => reject(new Error(`Timeout after 2000ms`)), 2000));

      await Promise.race([p1, p2]);
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
}
