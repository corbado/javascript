import type {
  CorbadoError,
  ICorbadoAppParams,
  IProjectConfig,
  IUser,
  LoginHandler,
  UserAuthMethodsInterface,
} from '@corbado/web-core';
import { createContext, type PropsWithChildren } from 'react';
import type { Result } from 'ts-results';
import {NonRecoverableError} from "@corbado/web-core";

export type IAppProviderParams = PropsWithChildren<ICorbadoAppParams>;

export interface CorbadoContextInterface {
  shortSession: string | undefined;
  user: IUser | undefined;
  globalError: NonRecoverableError | undefined;
  signUpWithPasskey: (email: string, username: string) => Promise<Result<void, CorbadoError>>;
  loginWithPasskey: (email: string) => Promise<Result<void, CorbadoError>>;
  initLoginWithEmailOTP: (email: string) => Promise<Result<void, CorbadoError>>;
  completeLoginWithEmailOTP: (code: string) => Promise<Result<void, CorbadoError>>;
  logout: () => void;
  initSignUpWithEmailOTP: (email: string, username: string) => Promise<Result<void, CorbadoError>>;
  completeSignUpWithEmailOTP: (code: string) => Promise<Result<void, CorbadoError>>;
  initAutocompletedLoginWithPasskey: () => Promise<Result<LoginHandler, CorbadoError>>;
  appendPasskey: () => Promise<Result<void, CorbadoError>>;
  getUserAuthMethods: (email: string) => Promise<UserAuthMethodsInterface>;
  getProjectConfig: () => Promise<IProjectConfig>;
}

const missingImplementation = (): never => {
  throw new Error('Please make sure that your components are wrapped inside <CorbadoProvider/>');
};

export const initialContext = {
  shortSession: undefined,
  user: undefined,
  globalError: undefined,
  signUpWithPasskey: missingImplementation,
  loginWithPasskey: missingImplementation,
  initLoginWithEmailOTP: missingImplementation,
  completeLoginWithEmailOTP: missingImplementation,
  logout: missingImplementation,
  initSignUpWithEmailOTP: missingImplementation,
  completeSignUpWithEmailOTP: missingImplementation,
  initAutocompletedLoginWithPasskey: missingImplementation,
  appendPasskey: missingImplementation,
  getUserAuthMethods: missingImplementation,
  getProjectConfig: missingImplementation,
};

const CorbadoContext = createContext<CorbadoContextInterface>(initialContext);

export default CorbadoContext;
