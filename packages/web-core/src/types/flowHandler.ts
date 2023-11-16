import type {
  CommonScreens,
  EmailOtpSignupScreens,
  LoginFlowNames,
  PasskeyLoginWithEmailOtpFallbackScreens,
  PasskeySignupWithEmailOtpFallbackScreens,
  SignUpFlowNames,
} from "../utils/constants/flowHandler";
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
 * Type for the parameters that step functions within the flows can accept.
 */
export type StepFunctionParams = Record<
  string,
  string | boolean | number | undefined
>;

/**
 * Type definition for a function that represents a step in an authentication flow.
 */
export type StepFunction = (
  /** Project configuration. */
  projectConfig: IProjectConfig,
  /** Flow handler configuration. */
  flowHandlerConfig: IFlowHandlerConfig,
  /** User input parameters. */
  userInput: StepFunctionParams
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

/**
 * Base interface for screens involved in passkey-related authentication flows.
 */
export interface IPasskeyBaseScreen extends StepFunctionParams {
  /** Flag indicating success. */
  success?: boolean;
  /** Flag indicating failure. */
  failure?: boolean;
  /** Flag indicating cancellation. */
  cancel?: boolean;
  /** Flag indicating if an OTP email should be sent. */
  sendOtpEmail?: boolean;
  /** Flag for showing benefits of the service. */
  showBenefits?: boolean;
  /** Flag indicating an option for the user to proceed later. */
  maybeLater?: boolean;
  /** Flag indicating if the user is authenticated. */
  isUserAuthenticated?: boolean;
  /** Flag indicating if the user has a passkey. */
  userHasPasskey?: boolean;
}

/**
 * Type representing the screen displayed during a sign-up process when a passkey error occurs.
 */
export type ISignupPasskeyErrorScreen = Pick<
  IPasskeyBaseScreen,
  "success" | "cancel" | "sendOtpEmail" | "isUserAuthenticated"
>;

/**
 * Type representing the screen displayed during the sign-up process that shows the benefits of signing up with a passkey.
 */
export type ISignupPasskeyBenefitsScreen = Pick<
  IPasskeyBaseScreen,
  "success" | "failure" | "maybeLater" | "isUserAuthenticated"
>;

/**
 * Type representing the screen where users can append a passkey during the sign-up process.
 */
export type ISignupPasskeyAppendScreen = Pick<
  IPasskeyBaseScreen,
  "success" | "failure" | "maybeLater" | "showBenefits"
>;

/**
 * Type representing the screen for creating a new passkey during the sign-up process.
 */
export type ISignupPasskeyCreateScreen = Pick<
  IPasskeyBaseScreen,
  "success" | "failure" | "sendOtpEmail" | "showBenefits"
>;

/**
 * Type representing the initial login screen where users start the authentication process.
 */
export type ILoginInitScreen = Pick<
  IPasskeyBaseScreen,
  "success" | "failure" | "sendOtpEmail"
>;

/**
 * Type representing the login screen where users can append their passkey if they have one.
 */
export type ILoginPasskeyAppendScreen = Pick<
  IPasskeyBaseScreen,
  "success" | "failure" | "maybeLater"
>;

/**
 * Type representing the login screen displayed when there is an error in the passkey process.
 */
export type ILoginPasskeyErrorScreen = Pick<
  IPasskeyBaseScreen,
  "success" | "cancel" | "sendOtpEmail" | "isUserAuthenticated"
>;

/**
 * Type representing the login screen where users are prompted to enter their email OTP.
 */
export type ILoginEmailOtpScreen = Pick<
  IPasskeyBaseScreen,
  "success" | "failure" | "userHasPasskey"
>;
