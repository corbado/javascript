import type { CorbadoAppParams, PassKeyList, ProjectConfig, SessionUser, UserAuthMethods } from '@corbado/types';
import type {
  AppendPasskeyError,
  CompleteLoginWithEmailOTPError,
  CompleteSignupWithEmailOTPError,
  InitLoginWithEmailOTPError,
  InitSignUpWithEmailOTPError,
  LoginWithPasskeyError,
  NonRecoverableError,
  PasskeyDeleteError,
  PasskeyListError,
  SignUpWithPasskeyError,
} from '@corbado/web-core';
import { createContext, type PropsWithChildren } from 'react';
import type { Result } from 'ts-results';

export type AppProviderParams = PropsWithChildren<CorbadoAppParams>;

export interface CorbadoContextProps {
  shortSession: string | undefined;
  user: SessionUser | undefined;
  globalError: NonRecoverableError | undefined;
  loading: boolean;
  signUpWithPasskey: (email: string, username: string) => Promise<Result<void, SignUpWithPasskeyError>>;
  loginWithPasskey: (email: string) => Promise<Result<void, LoginWithPasskeyError>>;
  loginWithConditionalUI: () => Promise<Result<void, LoginWithPasskeyError>>;
  initLoginWithEmailOTP: (email: string) => Promise<Result<void, InitLoginWithEmailOTPError>>;
  completeLoginWithEmailOTP: (code: string) => Promise<Result<void, CompleteLoginWithEmailOTPError>>;
  logout: () => void;
  initSignUpWithEmailOTP: (email: string, username: string) => Promise<Result<void, InitSignUpWithEmailOTPError>>;
  completeSignUpWithEmailOTP: (code: string) => Promise<Result<void, CompleteSignupWithEmailOTPError>>;
  appendPasskey: () => Promise<Result<void, AppendPasskeyError>>;
  getUserAuthMethods: (email: string) => Promise<UserAuthMethods>;
  passkeyList: () => Promise<Result<PassKeyList, PasskeyListError>>;
  passkeyDelete: (id: string) => Promise<Result<void, PasskeyDeleteError>>;
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
  loginWithConditionalUI: missingImplementation,
  initLoginWithEmailOTP: missingImplementation,
  completeLoginWithEmailOTP: missingImplementation,
  logout: missingImplementation,
  initSignUpWithEmailOTP: missingImplementation,
  completeSignUpWithEmailOTP: missingImplementation,
  initAutocompletedLoginWithPasskey: missingImplementation,
  appendPasskey: missingImplementation,
  passkeyList: missingImplementation,
  passkeyDelete: missingImplementation,
  getUserAuthMethods: missingImplementation,
  getProjectConfig: missingImplementation,
};

export const CorbadoContext = createContext<CorbadoContextProps>(initialContext);
