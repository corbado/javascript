import type { PassKeyList, ProjectConfig, UserAuthMethods } from '@corbado/types';
import type {
  AuthMethodsListError,
  CorbadoApp,
  GetProjectConfigError,
  NonRecoverableError,
  PasskeyDeleteError,
  PasskeyListError,
  RecoverableError,
} from '@corbado/web-core';
import { createContext } from 'react';
import type { Result } from 'ts-results';

export interface CorbadoAppContextProps {
  corbadoApp: CorbadoApp | undefined;
  globalError: NonRecoverableError | undefined;
  loading: boolean;
  isAuthenticated: boolean;

  /** Passkey Management APIs */
  getPasskeys: () => Promise<Result<PassKeyList, PasskeyListError>>;
  deletePasskey: (id: string) => Promise<Result<void, PasskeyDeleteError>>;

  /** Other APIs */
  getProjectConfig: () => Promise<Result<ProjectConfig, GetProjectConfigError | undefined>>;
  getUserAuthMethods: (email: string) => Promise<Result<UserAuthMethods, AuthMethodsListError | undefined>>;
  userExists(email: string): Promise<Result<boolean, RecoverableError | undefined>>;
  logout: () => void;
  setGlobalError: (error: NonRecoverableError | undefined) => void;
}

const missingImplementation = (): never => {
  throw new Error('Please make sure that your components are wrapped inside <CorbadoProvider/>');
};

export const initialContext: CorbadoAppContextProps = {
  corbadoApp: undefined,
  globalError: undefined,
  loading: false,
  isAuthenticated: false,
  logout: missingImplementation,
  getPasskeys: missingImplementation,
  deletePasskey: missingImplementation,
  getUserAuthMethods: missingImplementation,
  getProjectConfig: missingImplementation,
  userExists: missingImplementation,
  setGlobalError: missingImplementation,
};

export const CorbadoAppContext = createContext<CorbadoAppContextProps>(initialContext);
