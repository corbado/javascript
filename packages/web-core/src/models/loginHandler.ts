import type { Result } from 'ts-results';

import type { CompleteAutocompletedLoginWithPasskeyError } from '../utils/errors/errors';

type CompletionCallback = () => Promise<Result<void, CompleteAutocompletedLoginWithPasskeyError>>;

/**
 * Class representing a login handler.
 * @class LoginHandler
 */
export class LoginHandler {
  readonly #completionCallback: CompletionCallback;

  /**
   * Create a login handler.
   * @constructor
   * @param {CompletionCallback} completionCallback - A callback function to be executed upon completion.
   */
  constructor(completionCallback: CompletionCallback) {
    this.#completionCallback = completionCallback;
  }

  /**
   * Get the completion callback function.
   * @return {CompletionCallback} The completion callback function.
   */
  public get completionCallback(): CompletionCallback {
    return this.#completionCallback;
  }
}
