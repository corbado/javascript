import type { PassKeyList, SessionUser } from '@corbado/types';
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
  logout: () => void;
  getPasskeys: () => Promise<Result<PassKeyList, PasskeyListError>>;
  deletePasskey: (id: string) => Promise<Result<void, PasskeyDeleteError>>;

  globalError: NonRecoverableError | undefined;
  setGlobalError: (error: NonRecoverableError | undefined) => void;
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
  setGlobalError: missingImplementation,
};

export const CorbadoSessionContext = createContext<CorbadoSessionContextProps>(initialContext);
