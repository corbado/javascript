import type { Result } from 'ts-results';

import type { CorbadoError } from './errors';

export class LoginHandler {
  readonly #completionCallback: () => Promise<Result<void, CorbadoError>>;

  constructor(completionCallback: () => Promise<Result<void, CorbadoError>>) {
    this.#completionCallback = completionCallback;
  }

  public get completionCallback() {
    return this.#completionCallback;
  }
}
