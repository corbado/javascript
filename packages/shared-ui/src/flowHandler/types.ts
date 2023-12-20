import type { SessionUser } from '@corbado/types';
import type { RecoverableError } from '@corbado/web-core';

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
import type { FlowHandlerState } from './flowHandlerState';
import type { FlowUpdate } from './flowUpdate';

/**
 * Configuration settings for handling different authentication flows.
 */
export interface FlowHandlerConfig {
  // callback that will be executed when a flow reached its end
  onLoggedIn: () => void;
  // initial flow to start with
  initialFlowType: FlowType;
}

/**
 * Configuration options for the passkey sign-up with email OTP fallback flow.
 */
export interface SignupOptions {
  passkeyAppend: boolean;
  retryPasskeyOnError: boolean;
}

/**
 * Configuration options for the passkey login with email OTP fallback flow.
 */
export interface LoginOptions {
  passkeyAppend: boolean;
  retryPasskeyOnError: boolean;
}

/**
 * Configuration options for the authentication flows.
 */
export type FlowOptions = SignupOptions | LoginOptions;

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

export interface FlowHandlerEventOptions {
  // Current user's authentication status
  isUserAuthenticated?: boolean;
  // Whether the user has a passkey already set up
  userHasPasskey?: boolean;
  userStateUpdate?: UserState;
  emailOTPCode?: string;
}

/**
 * Type definition for a function that represents a step in an authentication flow.
 */
export type StepFunction = (
  state: FlowHandlerState,
  event?: FlowHandlerEvents,
  eventOptions?: FlowHandlerEventOptions,
) => Promise<FlowUpdate | undefined>;

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
 * All state that can be generated by the user within the CorabdoAuth component.
 * This state is used internally by the flowHandler to determine the next step in the authentication flow and to
 * update the UI accordingly.
 */
export type UserState = {
  email?: string;
  emailOTPState?: EmailOTPState;
  fullName?: string;
  emailError?: RecoverableError;
  userNameError?: RecoverableError;
  emailOTPError?: RecoverableError;
};

/**
 * Dynamic part of FLowHandlerState that can be updated.
 */
export type FlowHandlerStateUpdate = {
  userState?: UserState;
  user?: SessionUser;
};

export type EmailOTPState = {
  lastMailSent: Date;
};
