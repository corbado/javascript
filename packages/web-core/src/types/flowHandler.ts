import type {
  CommonScreens,
  EmailOtpSignupScreens,
  LoginFlowNames,
  PasskeyLoginWithEmailOtpFallbackScreens,
  PasskeySignupWithEmailOtpFallbackScreens,
  SignUpFlowNames,
} from '../utils';

export enum FlowType {
  SignUp,
  Login,
}

/**
 * Configuration settings for handling different authentication flows.
 */
export interface IFlowHandlerConfig {
  // callback that will be executed when a flow reached its end
  onLoggedIn: () => void;
  // initial flow to start with
  initialFlowType: FlowType;
}

export type FlowOptions = PasskeySignupWithEmailOtpFallbackOptions;

export interface PasskeySignupWithEmailOtpFallbackOptions {
  passkeyAppend: boolean;
  retryPasskeyOnError: boolean;
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
  // Options that configure the behaviour of a single flow
  flowOptions: FlowOptions,
  // User input parameters.
  event?: string,
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
