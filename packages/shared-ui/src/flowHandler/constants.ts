export enum FlowType {
  SignUp,
  Login,
}

export enum SignUpFlowNames {
  PasskeySignupWithEmailOTPFallback = 'PasskeySignupWithEmailOTPFallback',
}

export enum LoginFlowNames {
  PasskeyLoginWithEmailOTPFallback = 'PasskeyLoginWithEmailOTPFallback',
}

export const FlowNameByFlowStyle: Record<string, { SignUp: SignUpFlowNames; Login: LoginFlowNames }> = {
  PasskeyWithEmailOTPFallback: {
    SignUp: SignUpFlowNames.PasskeySignupWithEmailOTPFallback,
    Login: LoginFlowNames.PasskeyLoginWithEmailOTPFallback,
  },
};

export enum CommonScreens {
  Start = 'start',
  End = 'end',
  EnterOtp = 'enter-otp',
  PasskeyError = 'passkey-error',
}

export enum EmailOtpSignupScreens {
  Start = 'start',
  EnterOtp = 'enter-otp',
  PasskeyOption = 'passkey-option',
  PasskeyBenefits = 'passkey-benefits',
  PasskeyWelcome = 'passkey-welcome',
  PasskeyError = 'passkey-error',
  End = 'end',
}

export enum PasskeySignupWithEmailOtpFallbackScreens {
  Start = 'start',
  CreatePasskey = 'create-passkey',
  EnterOtp = 'enter-otp',
  PasskeyBenefits = 'passkey-benefits',
  PasskeyError = 'passkey-error',
  PasskeyWelcome = 'passkey-welcome',
  PasskeyAppend = 'passkey-append',
  End = 'end',
}

export enum PasskeyLoginWithEmailOtpFallbackScreens {
  Start = 'start',
  EnterOtp = 'enter-otp',
  PasskeyError = 'passkey-error',
  PasskeyAppend = 'passkey-append',
  PasskeyBenefits = 'passkey-benefits',
  End = 'end',
}

export enum FlowHandlerEvents {
  ShowBenefits = 'show-benefits',
  CancelOtp = 'cancel-otp',
  ChangeFlow = 'change-flow',
  PrimaryButton = 'primary-button',
  SecondaryButton = 'secondary-button',
  InitConditionalUI = 'init-conditional-ui',
}
