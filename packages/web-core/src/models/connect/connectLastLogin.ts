import type { LoginIdentifierType } from '@corbado/types';

const getStorageKey = (projectId: string) => `cbo_connect_last_login-${projectId}`;

export class ConnectLastLogin {
  readonly identifierType: LoginIdentifierType;
  readonly identifierValue: string;
  readonly isCDA: boolean;
  readonly operationType: string;

  constructor({
    identifierType,
    identifierValue,
    isCDA,
    operationType,
  }: {
    identifierType: string;
    identifierValue: string;
    isCDA: boolean;
    operationType: string;
  }) {
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

    const process = new ConnectLastLogin(JSON.parse(serialized));

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
