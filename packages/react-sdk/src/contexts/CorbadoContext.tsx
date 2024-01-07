import type { PassKeyList, ProjectConfig, SessionUser, UserAuthMethods } from '@corbado/types';
import type {
  AppendPasskeyError,
  AuthMethodsListError,
  CompleteLoginWithEmailOTPError,
  CompleteSignupWithEmailOTPError,
  GetProjectConfigError,
  InitLoginWithEmailOTPError,
  InitSignUpWithEmailOTPError,
  LoginWithPasskeyError,
  NonRecoverableError,
  PasskeyDeleteError,
  PasskeyListError,
  RecoverableError,
  SignUpWithPasskeyError,
} from '@corbado/web-core';
import type { CorbadoApp } from '@corbado/web-core';
import { createContext } from 'react';
import type { Result } from 'ts-results';

export interface CorbadoContextProps {
  corbadoApp: CorbadoApp | undefined;
  shortSession: string | undefined;
  user: SessionUser | undefined;
  globalError: NonRecoverableError | undefined;
  loading: boolean;
  signUpWithPasskey: (email: string, username: string) => Promise<Result<void, SignUpWithPasskeyError | undefined>>;
  loginWithPasskey: (email: string) => Promise<Result<void, LoginWithPasskeyError | undefined>>;
  loginWithConditionalUI: () => Promise<Result<void, LoginWithPasskeyError | undefined>>;
  initLoginWithEmailOTP: (email: string) => Promise<Result<void, InitLoginWithEmailOTPError | undefined>>;
  completeLoginWithEmailOTP: (code: string) => Promise<Result<void, CompleteLoginWithEmailOTPError | undefined>>;
  logout: () => void;
  initSignUpWithEmailOTP: (
    email: string,
    username: string,
  ) => Promise<Result<void, InitSignUpWithEmailOTPError | undefined>>;
  completeSignUpWithEmailOTP: (code: string) => Promise<Result<void, CompleteSignupWithEmailOTPError | undefined>>;
  appendPasskey: () => Promise<Result<void, AppendPasskeyError | undefined>>;
  getUserAuthMethods: (email: string) => Promise<Result<UserAuthMethods, AuthMethodsListError | undefined>>;
  getPasskeys: () => Promise<Result<PassKeyList, PasskeyListError>>;
  deletePasskey: (id: string) => Promise<Result<void, PasskeyDeleteError>>;
  getProjectConfig: () => Promise<Result<ProjectConfig, GetProjectConfigError | undefined>>;

  userExists(email: string): Promise<Result<boolean, RecoverableError | undefined>>;
}

const missingImplementation = (): never => {
  throw new Error('Please make sure that your components are wrapped inside <CorbadoProvider/>');
};

export const initialContext: CorbadoContextProps = {
  corbadoApp: undefined,
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
  appendPasskey: missingImplementation,
  getPasskeys: missingImplementation,
  deletePasskey: missingImplementation,
  getUserAuthMethods: missingImplementation,
  getProjectConfig: missingImplementation,
  userExists: missingImplementation,
};

export const CorbadoContext = createContext<CorbadoContextProps>(initialContext);
