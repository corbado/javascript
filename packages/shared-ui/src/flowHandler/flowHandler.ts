import type { FlowTypes, ProjectConfig, SessionUser } from '@corbado/types';
import type { CorbadoApp } from '@corbado/web-core';
import type { i18n } from 'i18next';

import { canUsePasskeys } from '../utils';
import type { FlowHandlerEvents } from './constants';
import { FlowType } from './constants';
import { ScreenNames } from './constants';
import { FlowHandlerConfig } from './flowHandlerConfig';
import { FlowHandlerState } from './flowHandlerState';
import { flows } from './flows';
import type { FlowHandlerEventOptions, FlowHandlerStateUpdate, FlowHandlerUpdates, UserState } from './types';

/**
 * FlowHandler is a class that manages the navigation flow of the application.
 * It keeps track of the current flow, the current screen, and the screen history.
 * It also provides methods for navigating to the next screen, navigating back, and changing the flow.
 */
export class FlowHandler {
  #currentScreen: ScreenNames;
  #screenHistory: ScreenNames[];
  #config: FlowHandlerConfig;
  #state: FlowHandlerState | undefined;

  #onFlowUpdateCallbacks: Array<(updates: FlowHandlerUpdates) => void> = [];
  #onUserStateChangeCallbacks: Array<(v: UserState) => void> = [];

  /**
   * The constructor initializes the FlowHandler with a flow name, a project configuration, and a flow handler configuration.
   * It sets the current flow to the specified flow, the current screen to the Start screen, and initializes the screen history as an empty array.
   */
  constructor(projectConfig: ProjectConfig, onLoggedIn: () => void, initialFlowType: FlowType = FlowType.SignUp) {
    this.#config = new FlowHandlerConfig(onLoggedIn, projectConfig, initialFlowType);
    this.#screenHistory = [];
    this.#currentScreen = this.#config.initialScreenName;
  }

  /**
   * Initializes the FlowHandler.
   * Call this function after registering all callbacks.
   */
  async init(corbadoApp: CorbadoApp | undefined, i18next: i18n) {
    if (!corbadoApp) {
      throw new Error('corbadoApp is undefined. This should not happen.');
    }

    const passkeysSupported = await canUsePasskeys();

    this.#state = new FlowHandlerState(
      this.#config.flowOptions,
      {
        email: undefined,
        fullName: undefined,
        emailError: undefined,
      },
      passkeysSupported,
      corbadoApp,
      i18next,
    );

    this.#changeFlow();
  }

  get currentScreenName() {
    return this.#currentScreen;
  }

  get currentFlowName() {
    return this.#config.flowName;
  }

  get currentFlowTypeText(): FlowTypes {
    return this.#config.flowType === FlowType.SignUp ? 'signup' : 'login';
  }

  get currentVerificationMethod() {
    return this.#config.verificationMethod;
  }

  /**
   * Method to add a callback function to be called when the current flow changes.
   * @param cb The callback function to be called when the current flow changes.
   * @returns The callback id.
   */
  onFlowChange(cb: (updates: FlowHandlerUpdates) => void) {
    const cbId = this.#onFlowUpdateCallbacks.push(cb) - 1;

    return cbId;
  }

  /**
   * Method to remove a callback function that was registered with onFlowChange.
   * @param cbId The callback id returned by onFlowChange.
   */
  removeOnFlowChangeCallback(cbId: number) {
    this.#onFlowUpdateCallbacks.splice(cbId, 1);
  }

  /**
   * Method to add a callback function to be called when the user state changes.
   * @param cb The callback function to be called when the user state changes.
   * @returns The callback id.
   */
  onUserStateChange(cb: (v: UserState) => void) {
    const cbId = this.#onUserStateChangeCallbacks.push(cb) - 1;

    return cbId;
  }

  /**
   * Method to remove a callback function that was registered with onUserStateChange.
   * @param cbId The callback id returned by onUserStateChange.
   */
  removeOnUserStateChange(cbId: number) {
    this.#onUserStateChangeCallbacks.splice(cbId, 1);
  }

  /**
   * Method to handle state updates. It calls the current flow's state updater with the current state, event, and event options.
   * If the state updater returns a flow update, it changes the flow, updates the state, and changes the screen as specified by the flow update.
   * @param event The event that triggered the state update.
   * @param eventOptions The options for the event.
   */
  async handleStateUpdate(event?: FlowHandlerEvents, eventOptions?: FlowHandlerEventOptions) {
    if (!this.#state) {
      throw new Error('FlowHandler is not initialized');
    }

    const stateUpdater = flows[this.#config.flowName][this.#currentScreen];
    if (!stateUpdater) {
      throw new Error('Invalid screen');
    }

    const flowUpdate = await stateUpdater(this.#state, event, eventOptions);
    if (flowUpdate && flowUpdate?.nextFlow !== null) {
      this.#changeFlow(flowUpdate.nextFlow);
    }

    if (flowUpdate?.stateUpdate) {
      this.#changeState({ userState: flowUpdate.stateUpdate });
    }

    if (flowUpdate?.nextScreen) {
      if (flowUpdate.nextScreen === ScreenNames.End) {
        return void this.#config.onLoggedIn();
      }

      this.#screenHistory.push(this.#currentScreen);
      this.#currentScreen = flowUpdate.nextScreen;

      this.#onFlowUpdateCallbacks.forEach(cb => cb({ screenName: this.#currentScreen }));
    }
  }

  //TODO: Remove navigateBack method and make it part as a state update as FlowHandlerEvents.Back
  /**
   * Method to navigate back to the previous screen.
   * If there is no previous screen, it navigates to the Start screen.
   * It sets the current screen to the last screen in the screen history, removes the last screen from the screen history, and calls any registered onScreenUpdate callbacks with the new current screen.
   * @returns The new current screen.
   */
  navigateBack() {
    if (!this.#screenHistory.length) {
      return ScreenNames.Start;
    }

    this.#currentScreen = this.#screenHistory.pop() || ScreenNames.Start;

    this.#onFlowUpdateCallbacks.forEach(cb => cb({ screenName: this.#currentScreen }));

    return this.#currentScreen;
  }

  //TODO: Remove update method and make it part as a state update by adding a subscriber on corbadoApp.authService.userChanges in FlowHandlerState
  /**
   * Method to update the user state with a new user.
   * @param user The new user.
   */
  update(user: SessionUser) {
    this.#changeState({ user: user });
  }

  /**
   * Method to change the current flow.
   * It sets the current flow to the specified flow, resets the current screen to the Start screen, and clears the screen history.
   * It calls any registered onFlowUpdate callbacks with the new flow, and any registered onScreenUpdate callbacks with the new current screen.
   * @param flowType - The new flow.
   * @param screen - The new current screen.
   * @returns The new current screen.
   */
  #changeFlow(flowType?: FlowType, screen?: ScreenNames) {
    if (flowType !== undefined) {
      this.#config.update(flowType);
    }

    const flowName = this.#config.flowName;
    const flowOptions = this.#config.flowOptions;
    const updatedScreen = screen || this.#config.initialScreenName;

    this.#changeState({ flowOptions });

    this.#currentScreen = updatedScreen;
    this.#screenHistory = [];

    this.#onFlowUpdateCallbacks.forEach(cb =>
      cb({
        flowName,
        flowType: this.currentFlowTypeText,
        verificationMethod: this.currentVerificationMethod,
        screenName: updatedScreen,
      }),
    );

    return updatedScreen;
  }

  #changeState(update: FlowHandlerStateUpdate) {
    if (!this.#state) {
      throw new Error('FlowHandler is not initialized');
    }

    this.#state.update(update);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.#onUserStateChangeCallbacks.forEach(cb => cb(this.#state!.userState));
  }
}
