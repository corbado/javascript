import type { LoginIdentifierType as ApiLoginIdentifierType } from '@corbado/web-core';

// Enum representing the type of user flow, either sign up or login
export enum AuthType {
  SignUp = 'signup',
  Login = 'login',
}

export enum LoginIdentifierType {
  Email = 'email',
  Phone = 'phone',
  Username = 'username',
}

export const createLoginIdentifierType = (v: ApiLoginIdentifierType): LoginIdentifierType => {
  switch (v) {
    case LoginIdentifierType.Email:
      return LoginIdentifierType.Email;
    case LoginIdentifierType.Phone:
      return LoginIdentifierType.Phone;
    case LoginIdentifierType.Username:
      return LoginIdentifierType.Username;
    default:
      throw new Error(`Unknown login identifier type: ${v}`);
  }
};

// Enum representing the names of different sign up flows
export enum SignUpFlowNames {
  PasskeySignupWithFallback = 'PasskeySignupWithFallback',
  SignupWithPasskeyAppend = 'SignupWithPasskeyAppend',
}

// Enum representing the names of different login flows
export enum LoginFlowNames {
  PasskeyLoginWithFallback = 'PasskeyLoginWithFallback',
}

// Enum representing common screens that are used in multiple flows
export enum ScreenNames {
  SignupInit = 'signup-init',
  LoginInit = 'login-init',
  End = 'end',
  EmailOtpVerification = 'email-otp-verification',
  EmailLinkSent = 'email-link-sent',
  PhoneOtp = 'phone-otp',
  EmailLinkVerification = 'email-link-verification',
  PasskeyError = 'passkey-error',
  PasskeyAppend = 'passkey-append',
  PasskeyBenefits = 'passkey-benefits',
  PasskeySuccess = 'passkey-success',
  PasskeyBackground = 'passkey-background',
  EditUserData = 'edit-user-data',
  EditEmail = 'edit-email',
  EditPhone = 'edit-phone',
  ContinueOnOtherEnv = 'continue-on-other-device',
}

// Map of passkey append intervals to their respective number of days
export const passkeyAppendIntervalMap: { [key: string]: number } = {
  '0d': 0,
  '1d': 1,
  '3d': 3,
  '1w': 7,
  '3w': 21,
  '1m': 30,
  '3m': 90,
};

export const passkeyAppendAskTSKey = 'corbado_passkeyAppendAskTS';

export enum BlockTypes {
  LoginInit = 'login-init',
  SignupInit = 'signup-init',
  EmailVerify = 'email-verify',
  PhoneVerify = 'phone-verify',
  PasskeyAppend = 'passkey-append',
  PasskeyVerify = 'passkey-verify',
  PasskeyAppended = 'passkey-appended',
  Completed = 'completed',
  ContinueOnOtherEnv = 'continue-on-other-env',
}

export enum InitState {
  Initializing, // the component is currently loading (we need to retrieve configuration from the backend first before we can render most parts of the component)
  Failed, // we were not able to retrieve the config from the backend => we can not render the component
  Success, // config from the backend has been loaded => we can render the component (there can still be NonRecoverableErrors, but we can always allow the end user to use the component)
}

export enum ContinueOnOtherEnvReasons {
  EmailLinkVerified = 'email-link-verified',
  ProcessAlreadyCompleted = 'process-already-completed',
}
