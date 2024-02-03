import type { PassKeyList, ProjectConfig, UserAuthMethods } from '@corbado/types';
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

export interface CorbadoAppContextProps {
  corbadoApp: CorbadoApp | undefined;
  globalError: NonRecoverableError | undefined;
  loading: boolean;
  isAuthenticated: boolean;

  /** Email OTP APIs */
  initSignUpWithEmailOTP: (
    email: string,
    username: string,
  ) => Promise<Result<void, InitSignUpWithEmailOTPError | undefined>>;
  completeSignUpWithEmailOTP: (code: string) => Promise<Result<void, CompleteSignupWithEmailOTPError | undefined>>;
  initLoginWithEmailOTP: (email: string) => Promise<Result<void, InitLoginWithEmailOTPError | undefined>>;
  completeLoginWithEmailOTP: (code: string) => Promise<Result<void, CompleteLoginWithEmailOTPError | undefined>>;

  /** Email Link APIs */
  initSignUpWithEmailLink: (
    email: string,
    username: string,
  ) => Promise<Result<void, InitSignUpWithEmailOTPError | undefined>>;
  completeSignUpWithEmailLink: (code: string) => Promise<Result<void, CompleteSignupWithEmailOTPError | undefined>>;
  initLoginWithEmailLink: (email: string) => Promise<Result<void, InitLoginWithEmailOTPError | undefined>>;
  completeLoginWithEmailLink: (code: string) => Promise<Result<void, CompleteLoginWithEmailOTPError | undefined>>;

  /** Passkey Authentication APIs */
  signUpWithPasskey: (email: string, username: string) => Promise<Result<void, SignUpWithPasskeyError | undefined>>;
  loginWithPasskey: (email: string) => Promise<Result<void, LoginWithPasskeyError | undefined>>;
  loginWithConditionalUI: () => Promise<Result<void, LoginWithPasskeyError | undefined>>;
  appendPasskey: () => Promise<Result<void, AppendPasskeyError | undefined>>;

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
  signUpWithPasskey: missingImplementation,
  loginWithPasskey: missingImplementation,
  loginWithConditionalUI: missingImplementation,
  initLoginWithEmailOTP: missingImplementation,
  completeLoginWithEmailOTP: missingImplementation,
  logout: missingImplementation,
  initSignUpWithEmailOTP: missingImplementation,
  completeSignUpWithEmailOTP: missingImplementation,
  initSignUpWithEmailLink: missingImplementation,
  completeSignUpWithEmailLink: missingImplementation,
  initLoginWithEmailLink: missingImplementation,
  completeLoginWithEmailLink: missingImplementation,
  appendPasskey: missingImplementation,
  getPasskeys: missingImplementation,
  deletePasskey: missingImplementation,
  getUserAuthMethods: missingImplementation,
  getProjectConfig: missingImplementation,
  userExists: missingImplementation,
  setGlobalError: missingImplementation,
};

export const CorbadoAppContext = createContext<CorbadoAppContextProps>(initialContext);
