export enum SignUpFlowNames {
  PasskeySignupWithEmailOTPFallback = 'PasskeySignupWithEmailOTPFallback',
  EmailOTPSignup = 'EmailOTPSignup',
}

export enum LoginFlowNames {
  PasskeyLoginWithEmailOTPFallback = 'PasskeyLoginWithEmailOTPFallback',
}

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
  End = 'end',
}
