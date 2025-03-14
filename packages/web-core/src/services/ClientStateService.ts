import type { LoginIdentifierType, PasskeyCeremonyType } from '@corbado/types';

import type { ClientStateMeta } from '../api/v2';
import { base64decode, base64encode } from '../utils';

const getStorageKeyClientHandle = (projectId: string) => `cbo_client_handle-${projectId}`;
const getStorageKeyClientHandleCompat = () => `cbo_client_handle`;
const getStorageKeyLastLogin = (projectId: string) => `cbo_connect_last_login-${projectId}`;

export enum Source {
  LocalStorage = 'LocalStorage',
  URL = 'URL',
}

type CombinedData = {
  clientEnvHandle: ClientStateEntry<string> | undefined;
  lastLogin: ClientStateEntry<LastLogin> | undefined;
};

export type LastLogin = {
  identifierType: LoginIdentifierType;
  identifierValue: string;
  ceremonyType: PasskeyCeremonyType;
  operationType: string;
};

export type ClientStateEntry<T> = {
  data: T;
  source: Source;
  ts: number;
};

export class ClientStateService {
  static enrichFromURL(projectId: string, encoded: string): void {
    const decoded = JSON.parse(base64decode(encoded)) as CombinedData;
    const existingClientEnvHandle = this.#getEntry<string>(getStorageKeyClientHandle(projectId));

    if (
      decoded.clientEnvHandle &&
      ((existingClientEnvHandle && decoded.clientEnvHandle.ts > existingClientEnvHandle.ts) || !existingClientEnvHandle)
    ) {
      this.#setClientEnvHandle(projectId, decoded.clientEnvHandle.data, Source.URL, decoded.clientEnvHandle.ts);
    }

    const existingLastLogin = this.#getEntry<LastLogin>(getStorageKeyLastLogin(projectId));
    if (
      decoded.lastLogin &&
      ((existingLastLogin && decoded.lastLogin.ts > existingLastLogin.ts) || !existingLastLogin)
    ) {
      this.#setLastLogin(projectId, decoded.lastLogin.data, Source.URL, decoded.lastLogin.ts);
    }
  }

  static encodeToURL(projectId: string): string {
    const data: CombinedData = {
      lastLogin: this.#getEntry<LastLogin>(getStorageKeyLastLogin(projectId)),
      clientEnvHandle: this.#getEntry<string>(getStorageKeyClientHandle(projectId)),
    };

    return base64encode(JSON.stringify(data));
  }

  static getLastLogin(projectId: string): ClientStateEntry<LastLogin> | undefined {
    const entry = this.#getEntry<LastLogin>(getStorageKeyLastLogin(projectId));
    if (entry) {
      return entry;
    }

    const compatValue = localStorage.getItem(getStorageKeyLastLogin(projectId));
    if (compatValue) {
      this.setLastLogin(projectId, JSON.parse(compatValue) as LastLogin);
      return this.#getEntry<LastLogin>(getStorageKeyLastLogin(projectId));
    }

    return;
  }

  static setLastLogin(projectId: string, lastLogin: LastLogin): void {
    this.#setLastLogin(projectId, lastLogin, Source.LocalStorage, Date.now());
  }

  static #setLastLogin(projectId: string, data: LastLogin | null, source: Source, ts: number): void {
    const entry: ClientStateEntry<LastLogin | null> = { data, source, ts };

    localStorage.setItem(getStorageKeyLastLogin(projectId), JSON.stringify(entry));
  }

  static clearLastLogin(projectId: string): void {
    this.#setLastLogin(projectId, null, Source.LocalStorage, Date.now());
  }

  static getClientEnvHandle(projectId: string): ClientStateEntry<string> | undefined {
    const entry = this.#getEntry<string>(getStorageKeyClientHandle(projectId));

    if (entry) {
      return entry;
    }

    const compatValue = localStorage.getItem(getStorageKeyClientHandleCompat());
    if (compatValue) {
      this.setClientEnvHandle(projectId, compatValue);
      return this.#getEntry<string>(getStorageKeyClientHandle(projectId));
    }

    return;
  }

  static setClientEnvHandle(projectId: string, clientEnvHandle: string): void {
    this.#setClientEnvHandle(projectId, clientEnvHandle, Source.LocalStorage, Date.now());
  }

  static #setClientEnvHandle(projectId: string, data: string, source: Source, ts: number): void {
    const entry: ClientStateEntry<string> = { data, source, ts };

    localStorage.setItem(getStorageKeyClientHandle(projectId), JSON.stringify(entry));
  }

  static #getEntry<T>(key: string): ClientStateEntry<T> | undefined {
    const serialized = localStorage.getItem(key);
    if (!serialized) {
      return undefined;
    }

    try {
      return JSON.parse(serialized) as ClientStateEntry<T>;
    } catch {
      return;
    }
  }

  static parseClientStateSource(source: Source): ClientStateMeta['source'] {
    switch (source) {
      case Source.LocalStorage:
        return 'ls';
      case Source.URL:
        return 'url';
      default:
        return 'ls';
    }
  }
}
