import type { ConnectAppendInitData, ConnectLoginInitData } from './login';

const getStorageKey = (projectId: string) => `cbo_connect_last_login-${projectId}`;

export class ConnectLastLogin {
  readonly identifierType: string;
  readonly identifierValue: string;
  readonly isCDA: boolean;
  readonly operationType: string;

  constructor(identifierType: string, identifierValue: string, isCDA: boolean, operationType: string) {
    this.identifierType = identifierType;
    this.identifierValue = identifierValue;
    this.isCDA = isCDA;
    this.operationType = operationType;
  }

  static loadFromStorage(projectId: string): ConnectLastLogin | undefined {
    const serialized = localStorage.getItem(getStorageKey(projectId));
    if (!serialized) {
      return undefined;
    }

    const { identifierType, identifierValue, isCDA, operationType } = JSON.parse(serialized);
    const process = new ConnectLastLogin(identifierType, identifierValue, isCDA, operationType);

    return process;
  }

  persistToStorage(projectId: string) {
    localStorage.setItem(
      getStorageKey(projectId),
      JSON.stringify({
        identifierType: this.identifierType,
        identifierValue: this.identifierValue,
        isCDA: this.isCDA,
        operationType: this.operationType,
      }),
    );
  }

  static clearStorage(projectId: string) {
    localStorage.removeItem(getStorageKey(projectId));
  }
}
