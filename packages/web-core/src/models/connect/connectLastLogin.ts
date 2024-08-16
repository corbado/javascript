import type { LoginIdentifierType, PasskeyCeremonyType } from '@corbado/types';

const getStorageKey = (projectId: string) => `cbo_connect_last_login-${projectId}`;

export class ConnectLastLogin {
  readonly identifierType: LoginIdentifierType;
  readonly identifierValue: string;
  readonly ceremonyType: PasskeyCeremonyType;
  readonly operationType: string;

  constructor({
    identifierType,
    identifierValue,
    ceremonyType,
    operationType,
  }: {
    identifierType: LoginIdentifierType;
    identifierValue: string;
    ceremonyType: PasskeyCeremonyType;
    operationType: string;
  }) {
    this.identifierType = identifierType;
    this.identifierValue = identifierValue;
    this.operationType = operationType;
    this.ceremonyType = ceremonyType;
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
        ceremonyType: this.ceremonyType,
        operationType: this.operationType,
      }),
    );
  }

  static clearStorage(projectId: string) {
    localStorage.removeItem(getStorageKey(projectId));
  }
}
