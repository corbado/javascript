import type { ConnectAppendInitData, ConnectLoginInitData, ConnectManageInitData } from './login';

const getStorageKey = (projectId: string) => `cbo_connect_process-${projectId}`;

export class ConnectProcess {
  readonly id: string;
  readonly projectId: string;
  readonly frontendApiUrl: string;
  readonly expiresAt: number;
  readonly loginData: ConnectLoginInitData | null;
  readonly appendData: ConnectAppendInitData | null;
  readonly manageData: ConnectManageInitData | null;

  constructor(
    id: string,
    projectId: string,
    expiresAt: number,
    frontendApiUrl: string,
    loginData: ConnectLoginInitData | null,
    appendData: ConnectAppendInitData | null,
    manageData: ConnectManageInitData | null,
  ) {
    this.id = id;
    this.projectId = projectId;
    this.expiresAt = expiresAt;
    this.frontendApiUrl = frontendApiUrl;
    this.loginData = loginData;
    this.appendData = appendData;
    this.manageData = manageData;
  }

  isValid(): boolean {
    return this.expiresAt > Date.now() / 1000;
  }

  copyWithLoginData(loginData: ConnectLoginInitData): ConnectProcess {
    return new ConnectProcess(
      this.id,
      this.projectId,
      this.expiresAt,
      this.frontendApiUrl,
      loginData,
      this.appendData,
      this.manageData,
    );
  }

  copyWithAppendData(appendData: ConnectAppendInitData): ConnectProcess {
    return new ConnectProcess(
      this.id,
      this.projectId,
      this.expiresAt,
      this.frontendApiUrl,
      this.loginData,
      appendData,
      this.manageData,
    );
  }

  copyWithManageData(manageData: ConnectManageInitData): ConnectProcess {
    return new ConnectProcess(
      this.id,
      this.projectId,
      this.expiresAt,
      this.frontendApiUrl,
      this.loginData,
      this.appendData,
      manageData,
    );
  }

  static loadFromStorage(projectId: string): ConnectProcess | undefined {
    const serialized = localStorage.getItem(getStorageKey(projectId));
    if (!serialized) {
      return undefined;
    }

    const { id, expiresAt, frontendApiUrl, loginData, appendData, manageData } = JSON.parse(serialized);
    const process = new ConnectProcess(id, projectId, expiresAt, frontendApiUrl, loginData, appendData, manageData);
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
        manageData: this.manageData,
      }),
    );
  }

  static clearStorage(projectId: string) {
    localStorage.removeItem(getStorageKey(projectId));
  }
}
