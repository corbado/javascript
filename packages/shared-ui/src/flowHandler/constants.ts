import type { FlowStyles } from '@corbado/types';

// Enum representing the type of user flow, either sign up or login
export enum FlowType {
  SignUp,
  Login,
}

// Enum representing the names of different sign up flows
export enum SignUpFlowNames {
  PasskeySignupWithEmailOTPFallback = 'PasskeySignupWithEmailOTPFallback',
  EmailOtpSignupWithPasskey = 'EmailOtpSignupWithPasskey',
}

// Enum representing the names of different login flows
export enum LoginFlowNames {
  PasskeyLoginWithEmailOTPFallback = 'PasskeyLoginWithEmailOTPFallback',
}

// Constant mapping different flow styles to their respective sign up and login flow names
// This is useful since BE sends the flow style in the response, but we need the flow name to initialize the flow
export const FlowNameByFlowStyle: Record<FlowStyles, { SignUp: SignUpFlowNames; Login: LoginFlowNames }> = {
  PasskeyWithEmailOTPFallback: {
    SignUp: SignUpFlowNames.PasskeySignupWithEmailOTPFallback,
    Login: LoginFlowNames.PasskeyLoginWithEmailOTPFallback,
  },
  EmailOtpSignup: {
    SignUp: SignUpFlowNames.EmailOtpSignupWithPasskey,
    Login: LoginFlowNames.PasskeyLoginWithEmailOTPFallback,
  },
};

// Enum representing common screens that are used in multiple flows
export enum CommonScreens {
  Start = 'start',
  End = 'end',
  EnterOtp = 'enter-otp',
  PasskeyError = 'passkey-error',
  PasskeyAppend = 'passkey-append',
  PasskeyBenefits = 'passkey-benefits',
}

// Enum representing the sequence of screens in the email OTP sign up flow
export enum EmailOtpSignupWithPasskeyScreens {
  Start = 'start',
  EnterOtp = 'enter-otp',
  PasskeyAppend = 'passkey-append',
  PasskeyBenefits = 'passkey-benefits',
  PasskeySuccess = 'passkey-success',
  PasskeyError = 'passkey-error',
  End = 'end',
}

// Enum representing the sequence of screens in the passkey sign up flow with email OTP fallback
export enum PasskeySignupWithEmailOtpFallbackScreens {
  Start = 'start',
  PasskeyCreate = 'passkey-create',
  EnterOtp = 'enter-otp',
  PasskeyBenefits = 'passkey-benefits',
  PasskeyError = 'passkey-error',
  PasskeySuccess = 'passkey-success',
  PasskeyAppend = 'passkey-append',
  End = 'end',
}

// Enum representing the sequence of screens in the passkey login flow with email OTP fallback
export enum PasskeyLoginWithEmailOtpFallbackScreens {
  Start = 'start',
  EnterOtp = 'enter-otp',
  PasskeyError = 'passkey-error',
  PasskeyAppend = 'passkey-append',
  PasskeyBenefits = 'passkey-benefits',
  End = 'end',
}

// Enum representing different events that can occur during the flow handling process
export enum FlowHandlerEvents {
  ShowBenefits = 'show-benefits',
  CancelOtp = 'cancel-otp',
  ChangeFlow = 'change-flow',
  PrimaryButton = 'primary-button',
  SecondaryButton = 'secondary-button',
  InitConditionalUI = 'init-conditional-ui',
}
