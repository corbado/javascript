import { create, get } from '@github/webauthn-json';
import type { Subject } from 'rxjs';
import type { Result } from 'ts-results';
import { Err, Ok } from 'ts-results';

import { CorbadoError, NonRecoverableError } from '../types';

export class AuthenticatorService {
  #globalErrors: Subject<NonRecoverableError | undefined>;

  constructor(globalErrors: Subject<NonRecoverableError | undefined>) {
    this.#globalErrors = globalErrors;
  }

  public createPasskey(serializedChallenge: string): Promise<Result<string, CorbadoError>> {
    return this.#handleWithGlobalErrors(async () => {
      try {
        const challenge = JSON.parse(serializedChallenge);
        const signedChallenge = await create(challenge);
        const serializedResponse = JSON.stringify(signedChallenge);

        return Ok(serializedResponse);
      } catch (e) {
        if (e instanceof DOMException) {
          return Err(CorbadoError.fromDOMException(e));
        } else {
          return Err(NonRecoverableError.fromUnknownException(e));
        }
      }
    });
  }

  public async login(serializedChallenge: string): Promise<Result<string, CorbadoError>> {
    return this.#handleWithGlobalErrors(async () => {
      try {
        const challenge = JSON.parse(serializedChallenge);
        const signedChallenge = await get(challenge);
        const serializedResponse = JSON.stringify(signedChallenge);

        return Ok(serializedResponse);
      } catch (e) {
        if (e instanceof DOMException) {
          return Err(CorbadoError.fromDOMException(e));
        } else {
          return Err(NonRecoverableError.fromUnknownException(e));
        }
      }
    });
  }

  async #handleWithGlobalErrors<T>(wrappedFunction: () => Promise<Result<T, CorbadoError>>) {
    const result = await wrappedFunction();
    if (result.err && result.val instanceof NonRecoverableError) {
      this.#globalErrors.next(result.val);
      return result;
    }

    return result;
  }
}
