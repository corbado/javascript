import type { ProjectConfig, VerificationMethods } from '@corbado/types';

import { FlowType, LoginFlowNames, ScreenNames, SignUpFlowNames } from './constants';
import type { FlowNames, FlowOptions, LoginOptions, SignupOptions } from './types';

// The FlowHandlerConfig class is responsible for managing the configuration of an authentication flow.
// It holds the processed version of the information from the project config, and other inputs of the FlowHandler.
export class FlowHandlerConfig {
  readonly #onLoggedIn: () => void;
  readonly #projectConfig: ProjectConfig;
  readonly #initialScreenName: ScreenNames;
  #flowType: FlowType;
  #flowName: FlowNames;
  #flowOptions: FlowOptions;

  constructor(onLoggedIn: () => void, projectConfig: ProjectConfig, initialFlowType: FlowType = FlowType.SignUp) {
    this.#onLoggedIn = onLoggedIn;
    this.#flowType = initialFlowType;
    this.#projectConfig = projectConfig;
    this.#flowName = this.#getCurrentFlowName();
    this.#flowOptions = this.#getCurrentFlowOptions();
    this.#initialScreenName = ScreenNames.Start;

    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('corbadoToken');

    if (token) {
      this.update(FlowType.Login);
      this.#initialScreenName = ScreenNames.EmailLinkVerification;
    }
  }

  get onLoggedIn() {
    return this.#onLoggedIn;
  }

  get flowType() {
    return this.#flowType;
  }

  get flowName() {
    return this.#flowName;
  }

  get flowOptions() {
    return this.#flowOptions;
  }

  get initialScreenName() {
    return this.#initialScreenName;
  }

  get verificationMethod(): VerificationMethods {
    return this.#flowOptions.verificationMethod ?? 'emailOtp';
  }

  // The update method allows the type of flow to be changed,
  // and updates the flow name and options accordingly.
  update(flowType: FlowType) {
    this.#flowType = flowType;
    this.#flowName = this.#getCurrentFlowName();
    this.#flowOptions = this.#getCurrentFlowOptions();
  }

  #getCurrentFlowOptions(): FlowOptions {
    return this.#flowType === FlowType.SignUp
      ? (this.#projectConfig.signupFlowOptions as SignupOptions)
      : (this.#projectConfig.loginFlowOptions as LoginOptions);
  }

  #getCurrentFlowName(): FlowNames {
    if (this.#flowType === FlowType.SignUp) {
      return this.#projectConfig.signupFlow === 'EmailOTPSignup'
        ? SignUpFlowNames.EmailOTPSignupWithPasskey
        : SignUpFlowNames.PasskeySignupWithEmailOTPFallback;
    }

    return LoginFlowNames.PasskeyLoginWithEmailOTPFallback;
  }
}
