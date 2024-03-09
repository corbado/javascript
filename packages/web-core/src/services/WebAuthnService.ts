import type { CredentialRequestOptionsJSON } from '@github/webauthn-json';
import { create, get } from '@github/webauthn-json';
import type { Result } from 'ts-results';
import { Err, Ok } from 'ts-results';

import { CorbadoError } from '../utils';

/**
 * AuthenticatorService handles all interactions with webAuthn platform authenticators.
 * Currently, this includes the creation of passkeys and the login with existing passkeys.
 */
export class WebAuthnService {
  #abortController: AbortController | undefined;

  async createPasskey(serializedChallenge: string): Promise<Result<string, CorbadoError>> {
    try {
      this.abortOngoingOperation();

      const challenge = JSON.parse(serializedChallenge);
      const abortController = new AbortController();
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

  async login(serializedChallenge: string, conditional: boolean): Promise<Result<string, CorbadoError>> {
    try {
      this.abortOngoingOperation();

      const challenge: CredentialRequestOptionsJSON = JSON.parse(serializedChallenge);
      const abortController = new AbortController();
      challenge.signal = abortController.signal;
      if (conditional) {
        challenge.mediation = 'conditional';
      }

      this.#abortController = abortController;
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

  public abortOngoingOperation() {
    this.#abortController?.abort();
  }
}
