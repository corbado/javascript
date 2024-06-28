import type { ConnectAppendInitData, ConnectLoginInitData } from './login';

const getStorageKey = (projectId: string) => `cbo_connect_process-${projectId}`;

export class ConnectProcess {
  readonly id: string;
  readonly projectId: string;
  readonly frontendApiUrl: string;
  readonly expiresAt: number;
  readonly loginData: ConnectLoginInitData | null;
  readonly appendData: ConnectAppendInitData | null;

  constructor(
    id: string,
    projectId: string,
    expiresAt: number,
    frontendApiUrl: string,
    loginData: ConnectLoginInitData | null,
    appendData: ConnectAppendInitData | null,
  ) {
    this.id = id;
    this.projectId = projectId;
    this.expiresAt = expiresAt;
    this.frontendApiUrl = frontendApiUrl;
    this.loginData = loginData;
    this.appendData = appendData;
  }

  isValid(): boolean {
    return this.expiresAt > Date.now() / 1000;
  }

  copyWithLoginData(loginData: ConnectLoginInitData): ConnectProcess {
    return new ConnectProcess(this.id, this.projectId, this.expiresAt, this.frontendApiUrl, loginData, this.appendData);
  }

  copyWithAppendData(appendData: ConnectAppendInitData): ConnectProcess {
    return new ConnectProcess(this.id, this.projectId, this.expiresAt, this.frontendApiUrl, this.loginData, appendData);
  }

  static loadFromStorage(projectId: string): ConnectProcess | undefined {
    const serialized = localStorage.getItem(getStorageKey(projectId));
    if (!serialized) {
      return undefined;
    }

    const { id, expiresAt, frontendApiUrl, loginData, appendData } = JSON.parse(serialized);
    const process = new ConnectProcess(id, projectId, expiresAt, frontendApiUrl, loginData, appendData);
    if (!process.isValid()) {
      return undefined;
    }

    return process;
  }

  persistToStorage() {
    localStorage.setItem(
      getStorageKey(this.projectId),
      JSON.stringify({
        id: this.id,
        expiresAt: this.expiresAt,
        frontendApiUrl: this.frontendApiUrl,
        loginData: this.loginData,
        appendData: this.appendData,
      }),
    );
  }

  static clearStorage(projectId: string) {
    localStorage.removeItem(getStorageKey(projectId));
  }
}
