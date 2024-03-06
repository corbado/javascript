// Enum representing the type of user flow, either sign up or login
export enum AuthType {
  SignUp,
  Login,
}

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
}
