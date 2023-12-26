import type { ProjectConfig } from '@corbado/types';

import { FlowNameByFlowStyle, FlowType } from './constants';
import type { FlowNames, FlowOptions } from './types';

export class FlowHandlerConfig {
  #onLoggedIn: () => void;
  #flowType: FlowType;
  #projectConfig: ProjectConfig;
  #flowName: FlowNames;
  #flowOptions: Partial<FlowOptions>;

  constructor(onLoggedIn: () => void, projectConfig: ProjectConfig, initialFlowType: FlowType = FlowType.SignUp) {
    this.#onLoggedIn = onLoggedIn;
    this.#flowType = initialFlowType;
    this.#projectConfig = projectConfig;
    this.#flowName = this.#getCurrentFlowName();
    this.#flowOptions = this.#getCurrentFlowOptions();
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

  update(flowType: FlowType) {
    this.#flowType = flowType;
    this.#flowName = this.#getCurrentFlowName();
    this.#flowOptions = this.#getCurrentFlowOptions();
  }

  #getCurrentFlowOptions(): Partial<FlowOptions> {
    return this.#flowType === FlowType.SignUp
      ? this.#projectConfig.signupFlowOptions
      : this.#projectConfig.loginFlowOptions;
  }

  #getCurrentFlowName(): FlowNames {
    return this.#flowType === FlowType.SignUp
      ? FlowNameByFlowStyle[this.#projectConfig.signupFlow].SignUp
      : FlowNameByFlowStyle[this.#projectConfig.loginFlow].Login;
  }
}
