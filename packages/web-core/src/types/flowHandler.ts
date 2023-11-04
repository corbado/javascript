import type { ProjectConfigRspAllOfData } from "../api/models";

export interface IFlowHandlerConfig {
  passkeyAppend: boolean;
  retryPasskeyOnError: boolean;
  compulsoryEmailVerification: boolean;
  shouldRedirect: boolean;
}

export type SignUpFlowNames =
  | "PasskeySignupWithEmailOTPFallback"
  | "EmailOTPSignup";

export type LoginFlowNames = "PasskeyLoginWithEmailOTPFallback";

export type FlowNames = SignUpFlowNames | LoginFlowNames;

export type EmailOtpSignupScreens = "start" | "enter-otp" | "end";

export type PasskeysSignupWithEmailOtpFallbackScreens =
  | "start"
  | "enter-otp"
  | "end";

export type PasskeyLoginWithEmailOtpFallbackScreens =
  | "start"
  | "enter-otp"
  | "end";

export type ScreenNames =
  | EmailOtpSignupScreens
  | PasskeysSignupWithEmailOtpFallbackScreens
  | PasskeyLoginWithEmailOtpFallbackScreens;

export type StepFunctionParams = number | string | boolean;

export type StepFunction = (
  projectCOnfig: ProjectConfigRspAllOfData,
  flowHandlerCOnfig: IFlowHandlerConfig,
  ...args: StepFunctionParams[]
) => ScreenNames;

export type Flow = {
  [K in ScreenNames]?: StepFunction;
};

export type Flows = Record<FlowNames, Flow>;
