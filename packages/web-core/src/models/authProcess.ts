const storageKey = 'cbo_auth_process';

export class AuthProcess {
  readonly sessionId: string;
  readonly expiresAt: number;

  constructor(sessionId: string, expiresAt: number) {
    this.sessionId = sessionId;
    this.expiresAt = expiresAt;
  }

  isValid(): boolean {
    return this.expiresAt > Date.now();
  }

  static loadFromStorage(): AuthProcess | undefined {
    const serialized = localStorage.getItem(storageKey);
    if (!serialized) {
      return undefined;
    }

    const { sessionId, expiresAt } = JSON.parse(serialized);
    const process = new AuthProcess(sessionId, expiresAt);
    if (!process.isValid()) {
      return undefined;
    }

    return process;
  }

  persistToStorage() {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        sessionId: this.sessionId,
        expiresAt: this.expiresAt,
      }),
    );
  }

  static clearStorage() {
    localStorage.removeItem(storageKey);
  }
}
