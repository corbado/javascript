import type { CorbadoUser, PassKeyList, SessionUser } from '@corbado/types';
import type { CorbadoApp, NonRecoverableError, PasskeyDeleteError, PasskeyListError } from '@corbado/web-core';
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
  getPasskeys: () => Promise<Result<PassKeyList, PasskeyListError>>;
  deletePasskey: (id: string) => Promise<Result<void, PasskeyDeleteError>>;
  getFullUser: () => Promise<Result<CorbadoUser, NonRecoverableError>>;
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
  getPasskeys: missingImplementation,
  deletePasskey: missingImplementation,
  getFullUser: missingImplementation,
};

export const CorbadoSessionContext = createContext<CorbadoSessionContextProps>(initialContext);
