import type {
  CommonScreens,
  EmailOtpSignupScreens,
  FlowHandlerEvents,
  FlowType,
  LoginFlowNames,
  PasskeyLoginWithEmailOtpFallbackScreens,
  PasskeySignupWithEmailOtpFallbackScreens,
  SignUpFlowNames,
} from './constants';

/**
 * Configuration settings for handling different authentication flows.
 */
export interface IFlowHandlerConfig {
  // callback that will be executed when a flow reached its end
  onLoggedIn: () => void;
  // initial flow to start with
  initialFlowType: FlowType;
}

/**
 * Configuration options for the authentication flows.
 */
export type FlowOptions = PasskeySignupWithEmailOtpFallbackOptions;

/**
 * Configuration options for the passkey sign-up with email OTP fallback flow.
 */
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

export interface FlowHandlerEventOptionsInterface {
  // Current user's authentication status
  isUserAuthenticated?: boolean;
  // Whether the user has a passkey already set up
  userHasPasskey?: boolean;
}

/**
 * Type definition for a function that represents a step in an authentication flow.
 */
export type StepFunction = (
  // Options that configure the behavior of a single flow
  flowOptions?: FlowOptions,
  // Event that triggered the step function
  event?: FlowHandlerEvents,
  // options that were passed to the step function
  eventOptions?: FlowHandlerEventOptionsInterface,
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
