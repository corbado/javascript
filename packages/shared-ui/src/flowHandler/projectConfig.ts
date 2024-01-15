import type { ProjectConfig } from '@corbado/types';

import { LoginFlowNames, SignUpFlowNames } from './constants';
import type { LoginOptions, SignupOptions } from './types';

export class UIProjectConfig {
  readonly #loginFlow: LoginFlowNames;
  readonly #loginFlowOptions: LoginOptions;
  readonly #signupFlow: SignUpFlowNames;
  readonly #signupFlowOptions: SignupOptions;

  constructor(
    loginFlow: LoginFlowNames,
    loginFlowOptions: LoginOptions,
    signupFlow: SignUpFlowNames,
    signupFlowOptions: SignupOptions,
  ) {
    this.#loginFlow = loginFlow;
    this.#loginFlowOptions = loginFlowOptions;
    this.#signupFlow = signupFlow;
    this.#signupFlowOptions = signupFlowOptions;
  }

  static fromProjectConfig(projectConfig: ProjectConfig): UIProjectConfig {
    const loginFlowOptions = projectConfig.loginFlowOptions as LoginOptions;
    let signupFlow = SignUpFlowNames.EmailOTPSignupWithPasskey,
      loginFlow = LoginFlowNames.PasskeyLoginWithEmailOTPFallback;
    if (projectConfig.signupFlow === 'EmailOTPSignup') {
      signupFlow = SignUpFlowNames.EmailOTPSignupWithPasskey;
    } else if (projectConfig.signupFlow === 'PasskeyWithEmailOTPFallback') {
      signupFlow = SignUpFlowNames.PasskeySignupWithEmailOTPFallback;
    }

    if (projectConfig.loginFlow === 'PasskeyWithEmailOTPFallback') {
      loginFlow = LoginFlowNames.PasskeyLoginWithEmailOTPFallback;
    }
    const signupFlowOptions = projectConfig.signupFlowOptions as SignupOptions;

    return new UIProjectConfig(loginFlow, loginFlowOptions, signupFlow, signupFlowOptions);
  }

  get loginFlow(): LoginFlowNames {
    return this.#loginFlow;
  }

  get loginFlowOptions(): LoginOptions {
    return this.#loginFlowOptions;
  }

  get signupFlow(): SignUpFlowNames {
    return this.#signupFlow;
  }

  get signupFlowOptions(): SignupOptions {
    return this.#signupFlowOptions;
  }
}
