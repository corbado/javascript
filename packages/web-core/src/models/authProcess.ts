const storageKey = 'cbo_auth_process';

export class AuthProcess {
  readonly id: string;
  readonly frontendApiUrl: string;
  readonly expiresAt: number;

  constructor(id: string, expiresAt: number, frontendApiUrl: string) {
    this.id = id;
    this.expiresAt = expiresAt;
    this.frontendApiUrl = frontendApiUrl;
  }

  isValid(): boolean {
    return this.expiresAt > Date.now() / 1000;
  }

  static loadFromStorage(): AuthProcess | undefined {
    const serialized = localStorage.getItem(storageKey);
    if (!serialized) {
      return undefined;
    }

    const { id, expiresAt, frontendApiUrl } = JSON.parse(serialized);
    const process = new AuthProcess(id, expiresAt, frontendApiUrl);
    if (!process.isValid()) {
      return undefined;
    }

    return process;
  }

  persistToStorage() {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        id: this.id,
        expiresAt: this.expiresAt,
        frontendApiUrl: this.frontendApiUrl,
      }),
    );
  }

  static clearStorage() {
    localStorage.removeItem(storageKey);
  }
}
