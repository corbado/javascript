// Enum representing the type of user flow, either sign up or login
export enum FlowType {
  SignUp,
  Login,
}

// Enum representing the names of different sign up flows
export enum SignUpFlowNames {
  PasskeySignupWithEmailOTPFallback = 'PasskeySignupWithEmailOTPFallback',
  EmailOTPSignupWithPasskey = 'EmailOTPSignupWithPasskey',
}

// Enum representing the names of different login flows
export enum LoginFlowNames {
  PasskeyLoginWithEmailOTPFallback = 'PasskeyLoginWithEmailOTPFallback',
}

// Enum representing common screens that are used in multiple flows
export enum ScreenNames {
  Start = 'start',
  End = 'end',
  EnterOTP = 'enter-otp',
  PasskeyError = 'passkey-error',
  PasskeyAppend = 'passkey-append',
  PasskeyBenefits = 'passkey-benefits',
  PasskeySuccess = 'passkey-success',
  PasskeyCreate = 'passkey-create',
}

// Enum representing different events that can occur during the flow handling process
export enum FlowHandlerEvents {
  ShowBenefits = 'show-benefits',
  CancelOTP = 'cancel-otp',
  CancelPasskey = 'cancel-passkey',
  ChangeFlow = 'change-flow',
  PrimaryButton = 'primary-button',
  SecondaryButton = 'secondary-button',
  InitConditionalUI = 'init-conditional-ui',
}
