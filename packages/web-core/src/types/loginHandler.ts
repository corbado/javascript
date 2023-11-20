export class LoginHandler {
  readonly #completionCallback: () => Promise<void>;

  constructor(completionCallback: () => Promise<void>) {
    this.#completionCallback = completionCallback;
  }

  public get completionCallback() {
    return this.#completionCallback;
  }
}
