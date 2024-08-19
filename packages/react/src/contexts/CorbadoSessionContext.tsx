import type { CorbadoUser, LoginIdentifierType, PassKeyList, SessionUser, UserDetailsConfig } from '@corbado/types';
import type { CorbadoApp, CorbadoError, NonRecoverableError, PasskeyDeleteError } from '@corbado/web-core';
import { createContext } from 'react';
import type { Result } from 'ts-results';

const missingImplementation = (): never => {
  throw new Error('Please make sure that your components are wrapped inside <CorbadoProvider/>');
};

export interface CorbadoSessionContextProps {
  corbadoApp: CorbadoApp | undefined;
  shortSession: string | undefined;
  loading: boolean;
  isAuthenticated: boolean;
  user: SessionUser | undefined;
  logout: () => Promise<void>;
  appendPasskey: () => Promise<Result<void, CorbadoError | undefined>>;
  getPasskeys: (abortController?: AbortController) => Promise<Result<PassKeyList, CorbadoError>>;
  deletePasskey: (id: string) => Promise<Result<void, PasskeyDeleteError>>;
  getFullUser: (abortController?: AbortController) => Promise<Result<CorbadoUser, CorbadoError>>;
  getUserDetailsConfig: (abortController?: AbortController) => Promise<Result<UserDetailsConfig, CorbadoError>>;
  updateFullName: (fullName: string) => Promise<Result<void, CorbadoError>>;
  updateUsername: (identifierId: string, username: string) => Promise<Result<void, CorbadoError>>;
  createIdentifier: (identifierType: LoginIdentifierType, value: string) => Promise<Result<void, CorbadoError>>;
  deleteIdentifier: (identifierId: string) => Promise<Result<void, CorbadoError>>;
  verifyIdentifierStart: (identifierId: string) => Promise<Result<void, CorbadoError>>;
  verifyIdentifierFinish: (identifierId: string, code: string) => Promise<Result<void, CorbadoError>>;
  deleteUser: () => Promise<Result<void, CorbadoError>>;
  globalError: NonRecoverableError | undefined;
}

export const initialContext: CorbadoSessionContextProps = {
  corbadoApp: undefined,
  shortSession: undefined,
  loading: true,
  isAuthenticated: false,
  user: undefined,
  globalError: undefined,
  logout: missingImplementation,
  appendPasskey: missingImplementation,
  getPasskeys: missingImplementation,
  deletePasskey: missingImplementation,
  getFullUser: missingImplementation,
  getUserDetailsConfig: missingImplementation,
  updateFullName: missingImplementation,
  updateUsername: missingImplementation,
  createIdentifier: missingImplementation,
  deleteIdentifier: missingImplementation,
  verifyIdentifierStart: missingImplementation,
  verifyIdentifierFinish: missingImplementation,
  deleteUser: missingImplementation,
};

export const CorbadoSessionContext = createContext<CorbadoSessionContextProps>(initialContext);
