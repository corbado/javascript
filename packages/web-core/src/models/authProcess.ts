const storageKey = 'cbo_auth_process';

export class AuthProcess {
  readonly id: string;
  readonly expiresAt: number;

  constructor(id: string, expiresAt: number) {
    this.id = id;
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

    const { id, expiresAt } = JSON.parse(serialized);
    const process = new AuthProcess(id, expiresAt);
    if (!process.isValid()) {
      return undefined;
    }

    return process;
  }

  persistToStorage() {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        sessionId: this.id,
        expiresAt: this.expiresAt,
      }),
    );
  }

  static clearStorage() {
    localStorage.removeItem(storageKey);
  }
}
