import type { LoginIdentifierType, PasskeyCeremonyType } from '@corbado/types';

import { base64decode, base64encode } from '../utils';

const getStorageKeyClientHandle = (projectId: string) => `cbo_client_handle-${projectId}`;
const getStorageKeyClientHandleCompat = () => `cbo_client_handle`;
const getStorageKeyLastLogin = (projectId: string) => `cbo_connect_last_login-${projectId}`;

enum Source {
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

type ClientStateEntry<T> = {
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

  static getLastLogin(projectId: string): LastLogin | undefined {
    const entry = this.#getEntry<LastLogin>(getStorageKeyLastLogin(projectId));
    if (entry) {
      return entry.data;
    }

    const serialized = localStorage.getItem(getStorageKeyLastLogin(projectId));
    if (!serialized) {
      return undefined;
    }

    return JSON.parse(serialized) as LastLogin;
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

  static getClientEnvHandle(projectId: string): string | undefined {
    const entry = this.#getEntry<string>(getStorageKeyClientHandle(projectId));

    if (entry) {
      return entry.data;
    }

    const compatEntry = this.#getEntry<string>(getStorageKeyClientHandleCompat());
    if (compatEntry) {
      this.#setClientEnvHandle(projectId, compatEntry.data, Source.LocalStorage, compatEntry.ts);
      return compatEntry.data;
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
}
