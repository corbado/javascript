import type {
  CommonScreens,
  EmailOtpSignupScreens,
  LoginFlowNames,
  PasskeyLoginWithEmailOtpFallbackScreens,
  PasskeySignupWithEmailOtpFallbackScreens,
  SignUpFlowNames,
} from "../utils";
import type { IProjectConfig } from "./common";

/**
 * Configuration settings for handling different authentication flows.
 */
export interface IFlowHandlerConfig {
  /** Indicates if appending a passkey is enabled. */
  passkeyAppend: boolean;
  /** Specifies if the process should retry passkey authentication upon an error. */
  retryPasskeyOnError: boolean;
  /** Determines if email verification is mandatory. */
  compulsoryEmailVerification: boolean;
  /** Indicates whether a redirect should occur after a flow step is completed. */
  shouldRedirect: boolean;
}

/**
 * Union type of all possible flow names for sign-up and login processes.
 */
export type FlowNames = SignUpFlowNames | LoginFlowNames;

/**
 * Union type of all possible screen names within the authentication flows.
 */
export type ScreenNames =
  | CommonScreens
  | EmailOtpSignupScreens
  | PasskeySignupWithEmailOtpFallbackScreens
  | PasskeyLoginWithEmailOtpFallbackScreens;

/**
 * Type definition for a function that represents a step in an authentication flow.
 */
export type StepFunction = (
  /** Project configuration. */
  projectConfig: IProjectConfig,
  /** Flow handler configuration. */
  flowHandlerConfig: IFlowHandlerConfig,
  /** User input parameters. */
  event?: string
) => ScreenNames | Promise<ScreenNames>;

/**
 * Type representing a dictionary of step functions for each screen in a flow.
 */
export type Flow = {
  [K in ScreenNames]?: StepFunction;
};

/**
 * Type representing a dictionary of flows for each flow name.
 */
export type Flows = Record<FlowNames, Flow>;
