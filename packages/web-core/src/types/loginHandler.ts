import type { Result } from 'ts-results';

import type { CompleteAutocompletedLoginWithPasskeyError } from './errors';

export class LoginHandler {
  readonly #completionCallback: () => Promise<Result<void, CompleteAutocompletedLoginWithPasskeyError>>;

  constructor(completionCallback: () => Promise<Result<void, CompleteAutocompletedLoginWithPasskeyError>>) {
    this.#completionCallback = completionCallback;
  }

  public get completionCallback() {
    return this.#completionCallback;
  }
}
