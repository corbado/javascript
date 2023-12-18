import type { CredentialRequestOptionsJSON } from '@github/webauthn-json';
import { create, get } from '@github/webauthn-json';
import type { Subject } from 'rxjs';
import type { Result } from 'ts-results';
import { Err, Ok } from 'ts-results';

import {CorbadoError, NonRecoverableError} from '../utils';


/**
 * AuthenticatorService handles all interactions with webAuthn platform authenticators.
 * Currently, this includes the creation of passkeys and the login with existing passkeys.
 */
export class WebAuthnService {
  #globalErrors: Subject<NonRecoverableError | undefined>;
  #abortController: AbortController | undefined;

  constructor(globalErrors: Subject<NonRecoverableError | undefined>) {
    this.#globalErrors = globalErrors;
  }

  public createPasskey(serializedChallenge: string): Promise<Result<string, CorbadoError>> {
    return this.#handleWithGlobalErrors(async () => {
      try {
        this.#abortController?.abort();

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
          return Err(CorbadoError.fromUnknownException(e));
        }
      }
    });
  }

  public async login(serializedChallenge: string, conditional: boolean): Promise<Result<string, CorbadoError>> {
    return this.#handleWithGlobalErrors(async () => {
      try {
        this.#abortController?.abort();

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
          return Err(CorbadoError.fromUnknownException(e));
        }
      }
    });
  }

  // we don't want to expose NonRecoverableError to the caller, so we catch it here and emit it on the globalErrors subject
  async #handleWithGlobalErrors<T>(wrappedFunction: () => Promise<Result<T, CorbadoError>>) {
    const result = await wrappedFunction();
    if (result.err && result.val instanceof NonRecoverableError) {
      this.#globalErrors.next(result.val);
      return result;
    }

    return result;
  }
}
