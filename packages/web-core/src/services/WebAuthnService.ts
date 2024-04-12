import type { CredentialRequestOptionsJSON } from '@github/webauthn-json';
import { create, get } from '@github/webauthn-json';
import type { Result } from 'ts-results';
import { Err, Ok } from 'ts-results';

import { CorbadoError } from '../utils';
const clientHandleKey = 'cbo_client_handle';

/**
 * AuthenticatorService handles all interactions with webAuthn platform authenticators.
 * Currently, this includes the creation of passkeys and the login with existing passkeys.
 */
export class WebAuthnService {
  async createPasskey(
    serializedChallenge: string,
    abortController: AbortController,
  ): Promise<Result<string, CorbadoError>> {
    try {
      const challenge = JSON.parse(serializedChallenge);
      challenge.signal = abortController.signal;

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
    abortController: AbortController,
    conditional: boolean,
  ): Promise<Result<string, CorbadoError>> {
    try {
      const challenge: CredentialRequestOptionsJSON = JSON.parse(serializedChallenge);
      challenge.signal = abortController.signal;
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

  static getClientHandle(): string | null {
    return localStorage.getItem(clientHandleKey);
  }

  static setClientHandle(clientHandle: string) {
    localStorage.setItem(clientHandleKey, clientHandle);
  }
}
