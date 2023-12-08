import type {
  AppendPasskeyError,
  CompleteLoginWithEmailOTPError,
  CompleteSignupWithEmailOTPError,
  ICorbadoAppParams,
  InitAutocompletedLoginWithPasskeyError,
  InitLoginWithEmailOTPError,
  InitSignUpWithEmailOTPError,
  LoginHandler,
  LoginWithPasskeyError,
  NonRecoverableError,
  SignUpWithPasskeyError,
} from '@corbado/web-core';
import type { ProjectConfig, SessionUser, UserAuthMethods } from '@corbado/types';
import { createContext, type PropsWithChildren } from 'react';
import type { Result } from 'ts-results';

export type IAppProviderParams = PropsWithChildren<ICorbadoAppParams>;

export interface CorbadoContextInterface {
  shortSession: string | undefined;
  user: SessionUser | undefined;
  globalError: NonRecoverableError | undefined;
  loading: boolean;
  signUpWithPasskey: (email: string, username: string) => Promise<Result<void, SignUpWithPasskeyError>>;
  loginWithPasskey: (email: string) => Promise<Result<void, LoginWithPasskeyError>>;
  initLoginWithEmailOTP: (email: string) => Promise<Result<void, InitLoginWithEmailOTPError>>;
  completeLoginWithEmailOTP: (code: string) => Promise<Result<void, CompleteLoginWithEmailOTPError>>;
  logout: () => void;
  initSignUpWithEmailOTP: (email: string, username: string) => Promise<Result<void, InitSignUpWithEmailOTPError>>;
  completeSignUpWithEmailOTP: (code: string) => Promise<Result<void, CompleteSignupWithEmailOTPError>>;
  initAutocompletedLoginWithPasskey: () => Promise<Result<LoginHandler, InitAutocompletedLoginWithPasskeyError>>;
  appendPasskey: () => Promise<Result<void, AppendPasskeyError>>;
  getUserAuthMethods: (email: string) => Promise<UserAuthMethods>;
  getProjectConfig: () => Promise<ProjectConfig>;
}

const missingImplementation = (): never => {
  throw new Error('Please make sure that your components are wrapped inside <CorbadoProvider/>');
};

export const initialContext = {
  shortSession: undefined,
  user: undefined,
  globalError: undefined,
  loading: false,
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
