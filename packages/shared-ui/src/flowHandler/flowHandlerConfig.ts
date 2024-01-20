import type { ProjectConfig } from '@corbado/types';

import { FlowType, LoginFlowNames, ScreenNames, SignUpFlowNames } from './constants';
import type { LoginOptions, SignupOptions, VerificationMethods } from './types';

interface FlowDetails {
  [FlowType.SignUp]: { name: SignUpFlowNames; options: SignupOptions };
  [FlowType.Login]: { name: LoginFlowNames; options: LoginOptions };
}

// The FlowHandlerConfig class is responsible for managing the configuration of an authentication flow.
// It holds the processed version of the information from the project config, and other inputs of the FlowHandler.
export class FlowHandlerConfig {
  readonly #onLoggedIn: () => void;
  readonly #initialScreenName: ScreenNames;
  readonly #flowDetails: FlowDetails;
  #flowType: FlowType;

  constructor(onLoggedIn: () => void, projectConfig: ProjectConfig, initialFlowType: FlowType = FlowType.SignUp) {
    this.#onLoggedIn = onLoggedIn;
    this.#flowType = initialFlowType;
    this.#flowDetails = this.#getFlowDetails(projectConfig);
    this.#initialScreenName = this.#getInitialScreenName();
  }

  get onLoggedIn() {
    return this.#onLoggedIn;
  }

  get flowType() {
    return this.#flowType;
  }

  get flowName() {
    return this.#flowDetails[this.#flowType].name;
  }

  get flowOptions() {
    return this.#flowDetails[this.#flowType].options;
  }

  get initialScreenName() {
    return this.#initialScreenName;
  }

  get verificationMethod(): VerificationMethods {
    return this.#flowDetails[this.#flowType].options.verificationMethod ?? 'emailOtp';
  }

  // The update method allows the type of flow to be changed,
  // and updates the flow name and options accordingly.
  update(flowType: FlowType) {
    this.#flowType = flowType;
  }

  #getFlowDetails(projectConfig: ProjectConfig) {
    return {
      [FlowType.SignUp]: {
        name:
          projectConfig.signupFlow === 'EmailOTPSignup'
            ? SignUpFlowNames.SignupWithPasskeyAppend
            : SignUpFlowNames.PasskeySignupWithFallback,
        options: projectConfig.signupFlowOptions as SignupOptions,
      },
      [FlowType.Login]: {
        name: LoginFlowNames.PasskeyLoginWithFallback,
        options: projectConfig.loginFlowOptions as LoginOptions,
      },
    };
  }

  #getInitialScreenName() {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('corbadoToken');

    if (token) {
      this.update(FlowType.Login);
      return ScreenNames.EmailLinkVerification;
    } else {
      return ScreenNames.Start;
    }
  }
}
