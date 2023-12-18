import type {SessionUser} from '@corbado/types';
import type {RecoverableError} from '@corbado/web-core';
import type {CorbadoApp} from '@corbado/web-core';

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
import type {FlowUpdate} from './stepFunctionResult';

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

export type UserState = {
  email?: string;
  emailOTPState?: EmailOTPState;
  fullName?: string;
  emailError?: RecoverableError;
  userNameError?: RecoverableError;
  emailOTPError?: RecoverableError;
};

export type FlowHandlerState = {
  flowOptions: FlowOptions;
  userState: UserState;
  passkeysSupported: boolean;
  user?: SessionUser;
  corbadoApp: CorbadoApp;
};

export type FlowHandlerStateUpdate = {
  userState?: UserState;
  user?: SessionUser;
};

export type EmailOTPState = {
  lastMailSent: Date;
};
