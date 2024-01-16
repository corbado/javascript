import { FlowType } from './constants';
import type { UIProjectConfig } from './projectConfig';
import type { FlowNames, FlowOptions } from './types';

// The FlowHandlerConfig class is responsible for managing the configuration of an authentication flow.
// It holds the current state of the flow, including the type of flow (sign up or login),
// the specific flow name, and any options associated with the flow.
export class FlowHandlerConfig {
  readonly #onLoggedIn: () => void;
  readonly #projectConfig: UIProjectConfig;
  #flowType: FlowType;
  #flowName: FlowNames;
  #flowOptions: Partial<FlowOptions>;

  constructor(onLoggedIn: () => void, projectConfig: UIProjectConfig, initialFlowType: FlowType = FlowType.SignUp) {
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

  // The update method allows the type of flow to be changed,
  // and updates the flow name and options accordingly.
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
    return this.#flowType === FlowType.SignUp ? this.#projectConfig.signupFlow : this.#projectConfig.loginFlow;
  }
}
