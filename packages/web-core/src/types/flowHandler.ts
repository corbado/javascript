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

export interface IPasskeyBaseScreen extends StepFunctionParams {
  success?: boolean;
  failure?: boolean;
  cancel?: boolean;
  sendOtpEmail?: boolean;
  showBenefits?: boolean;
  maybeLater?: boolean;
  isUserAuthenticated?: boolean;
}

export type ISignupPasskeyErrorScreen = Pick<
  IPasskeyBaseScreen,
  "success" | "cancel" | "sendOtpEmail" | "isUserAuthenticated"
>;

export type ISignupPasskeyBenefitsScreen = Pick<
  IPasskeyBaseScreen,
  "success" | "failure" | "maybeLater" | "isUserAuthenticated"
>;
export type ISignupPasskeyAppendScreen = Pick<
  IPasskeyBaseScreen,
  "success" | "failure" | "maybeLater" | "showBenefits"
>;

export type ISignupPasskeyCreateScreen = Pick<
  IPasskeyBaseScreen,
  "success" | "failure" | "sendOtpEmail" | "showBenefits"
>;
