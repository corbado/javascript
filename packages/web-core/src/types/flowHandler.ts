import type { IProjectConfig } from "./common";

export interface IFlowHandlerConfig {
  passkeyAppend: boolean;
  retryPasskeyOnError: boolean;
  compulsoryEmailVerification: boolean;
  shouldRedirect: boolean;
}

export enum SignUpFlowNames {
  PasskeySignupWithEmailOTPFallback = "PasskeySignupWithEmailOTPFallback",
  EmailOTPSignup = "EmailOTPSignup",
}

export enum LoginFlowNames {
  PasskeyLoginWithEmailOTPFallback = "PasskeyLoginWithEmailOTPFallback",
}

export type FlowNames = SignUpFlowNames | LoginFlowNames;

export enum CommonScreens {
  Start = "start",
  End = "end",
}

export enum EmailOtpSignupScreens {
  Start = "start",
  EnterOtp = "enter-otp",
  PasskeyOption = "passkey-option",
  PasskeyBenefits = "passkey-benefits",
  PasskeyWelcome = "passkey-welcome",
  PasskeyError = "passkey-error",
  End = "end",
}

export enum PasskeySignupWithEmailOtpFallbackScreens {
  Start = "start",
  EnterOtp = "enter-otp",
  End = "end",
}

export enum PasskeyLoginWithEmailOtpFallbackScreens {
  Start = "start",
  EnterOtp = "enter-otp",
  End = "end",
}

export type ScreenNames =
  | CommonScreens
  | EmailOtpSignupScreens
  | PasskeySignupWithEmailOtpFallbackScreens
  | PasskeyLoginWithEmailOtpFallbackScreens;

export type StepFunctionParams = Record<
  string,
  string | boolean | number | undefined
>;

export type StepFunction = (
  projectCOnfig: IProjectConfig,
  flowHandlerCOnfig: IFlowHandlerConfig,
  userInput: StepFunctionParams
) => ScreenNames | Promise<ScreenNames>;

export type Flow = {
  [K in ScreenNames]?: StepFunction;
};

export type Flows = Record<FlowNames, Flow>;
