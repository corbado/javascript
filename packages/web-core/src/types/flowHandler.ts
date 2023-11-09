import type {
  CommonScreens,
  EmailOtpSignupScreens,
  LoginFlowNames,
  PasskeyLoginWithEmailOtpFallbackScreens,
  PasskeySignupWithEmailOtpFallbackScreens,
  SignUpFlowNames,
} from "../utils/constants/flowHandler";
import type { IProjectConfig } from "./common";

export interface IFlowHandlerConfig {
  passkeyAppend: boolean;
  retryPasskeyOnError: boolean;
  compulsoryEmailVerification: boolean;
  shouldRedirect: boolean;
}

export type FlowNames = SignUpFlowNames | LoginFlowNames;

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
