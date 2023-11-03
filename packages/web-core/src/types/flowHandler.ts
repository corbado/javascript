import type { ProjectConfigRspAllOfData } from "../api/models";

export interface IFlowHandlerConfig {
  passkeyAppend: boolean;
  retryPasskeyOnError: boolean;
  compulsoryEmailVerification: boolean;
}

export type FlowNames =
  | "PasskeySignupWithEmailOTPFallback"
  | "EmailOTPSignup"
  | "PasskeyLoginWithEmailOTPFallback";

export type StepFunctionParams = number | string | boolean;

export type StepFunction = (
  projectCOnfig: ProjectConfigRspAllOfData,
  flowHandlerCOnfig: IFlowHandlerConfig,
  ...args: StepFunctionParams[]
) => string;

export type Flow = Record<string, StepFunction>;

export type Flows = Record<string, Flow>;
