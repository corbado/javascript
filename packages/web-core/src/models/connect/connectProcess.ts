import type { ConnectLoginInitData } from './login';

const storageKey = 'cbo_connect_process';

export class ConnectProcess {
  readonly id: string;
  readonly frontendApiUrl: string;
  readonly expiresAt: number;
  readonly loginData: ConnectLoginInitData | null;

  constructor(id: string, expiresAt: number, frontendApiUrl: string, loginData: ConnectLoginInitData | null) {
    this.id = id;
    this.expiresAt = expiresAt;
    this.frontendApiUrl = frontendApiUrl;
    this.loginData = loginData;
  }

  isValid(): boolean {
    return this.expiresAt > Date.now() / 1000;
  }

  copyWithLoginData(loginData: ConnectLoginInitData): ConnectProcess {
    return new ConnectProcess(this.id, this.expiresAt, this.frontendApiUrl, loginData);
  }

  static loadFromStorage(): ConnectProcess | undefined {
    const serialized = localStorage.getItem(storageKey);
    if (!serialized) {
      return undefined;
    }

    const { id, expiresAt, frontendApiUrl, loginData } = JSON.parse(serialized);
    const process = new ConnectProcess(id, expiresAt, frontendApiUrl, loginData);
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
        loginData: this.loginData,
      }),
    );
  }

  static clearStorage() {
    localStorage.removeItem(storageKey);
  }
}
