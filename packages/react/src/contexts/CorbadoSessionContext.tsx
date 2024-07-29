import type { CorbadoUser, PassKeyList, SessionUser } from '@corbado/types';
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
  updateName: (fullName: string) => Promise<Result<void, CorbadoError>>;
  updateUsername: (identifierID: string, username: string) => Promise<Result<void, CorbadoError>>;
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
  updateName: missingImplementation,
  updateUsername: missingImplementation,
};

export const CorbadoSessionContext = createContext<CorbadoSessionContextProps>(initialContext);
