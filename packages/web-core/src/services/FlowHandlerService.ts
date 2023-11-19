import type {Flow, FlowNames, IFlowHandlerConfig, IProjectConfig, ScreenNames,} from "../types"
import {FlowType} from "../types";
import {CommonScreens, flows, LoginFlowNames, SignUpFlowNames} from "../utils"

/**
 * FlowHandlerService is a class that manages the navigation flow of the application.
 * It keeps track of the current flow, the current screen, and the screen history.
 * It also provides methods for navigating to the next screen, navigating back, and changing the flow.
 */
export class FlowHandlerService {
  #currentFlow!: Flow
  #currentScreen: ScreenNames
  #screenHistory: ScreenNames[]
  #flowName!: FlowNames

  // @ts-ignore
  #projectConfig: IProjectConfig | undefined
  #flowHandlerConfig: IFlowHandlerConfig

  #onScreenUpdateCallbacks: Array<(screen: ScreenNames) => void> = []
  #onFlowUpdateCallbacks: Array<(flow: FlowNames) => void> = []

  /**
   * The constructor initializes the FlowHandlerService with a flow name, a project configuration, and a flow handler configuration.
   * It sets the current flow to the specified flow, the current screen to the Start screen, and initializes the screen history as an empty array.
   */
  constructor(
    projectConfig: IProjectConfig,
    flowHandlerConfig: IFlowHandlerConfig,
  ) {
    this.#flowHandlerConfig = flowHandlerConfig
    this.#screenHistory = []
    this.#currentScreen = CommonScreens.Start
    this.#projectConfig = projectConfig
  }

  async init() {
    this.changeFlow(this.#flowHandlerConfig.initialFlowType)
  }

  get currentScreenName() {
    return this.#currentScreen
  }

  get currentFlowName() {
    return this.#flowName
  }

  /**
   * Method to add a callback function to be called when the current screen changes.
   */
  onScreenChange(cb: (screen: ScreenNames) => void) {
    this.#onScreenUpdateCallbacks.push(cb)
  }

  /**
   * Method to add a callback function to be called when the current flow changes.
   */
  onFlowChange(cb: (flow: FlowNames) => void) {
    this.#onFlowUpdateCallbacks.push(cb)
  }

  /**
   * Method to navigate to the next screen.
   * It calls the step function of the current screen with the project configuration, the flow handler configuration, and the user input.
   * If the next screen is the End screen, it redirects to a specified URL.
   * It adds the current screen to the screen history, sets the current screen to the next screen, and calls any registered onScreenUpdate callbacks with the new current screen.
   * @returns The new current screen.
   * @param event
   */
  async navigateNext(event?: string) {
    const stepFunction = this.#currentFlow[this.#currentScreen]
    if (!stepFunction) {
      throw new Error("Invalid screen")
    }

    // TODO: extract flowOptions from projectConfig
    const nextScreen = await stepFunction(
      {
        passkeyAppend: true,
        retryPasskeyOnError: true,
      },
      event
    )

    if (nextScreen === CommonScreens.End) {
      void this.#flowHandlerConfig.onLoggedIn()
    }

    this.#screenHistory.push(this.#currentScreen)
    this.#currentScreen = nextScreen

    if (this.#onScreenUpdateCallbacks.length) {
      this.#onScreenUpdateCallbacks.forEach((cb) => cb(this.#currentScreen))
    }

    return nextScreen
  }

  /**
   * Method to navigate back to the previous screen.
   * If there is no previous screen, it navigates to the Start screen.
   * It sets the current screen to the last screen in the screen history, removes the last screen from the screen history, and calls any registered onScreenUpdate callbacks with the new current screen.
   * @returns The new current screen.
   */
  navigateBack() {
    if (!this.#screenHistory.length) {
      return CommonScreens.Start
    }

    this.#currentScreen = this.#screenHistory.pop() || CommonScreens.Start

    if (this.#onScreenUpdateCallbacks.length) {
      this.#onScreenUpdateCallbacks.forEach((cb) => cb(this.#currentScreen))
    }

    return this.#currentScreen
  }

  /**
   * Method to change the current flow.
   * It sets the current flow to the specified flow, resets the current screen to the Start screen, and clears the screen history.
   * It calls any registered onFlowUpdate callbacks with the new flow, and any registered onScreenUpdate callbacks with the new current screen.
   * @returns The new current screen.
   * @param flowType
   */
  changeFlow(flowType: FlowType) {
    // TODO: get flow name from flow type (currently this is basically hardcoded)
    let flowName: FlowNames
    if (flowType === FlowType.SignUp) {
      flowName = SignUpFlowNames.PasskeySignupWithEmailOTPFallback
    } else {
      flowName = LoginFlowNames.PasskeyLoginWithEmailOTPFallback
    }

    this.#currentFlow = flows[flowName]
    this.#flowName = flowName
    this.#currentScreen = CommonScreens.Start
    this.#screenHistory = []

    if (this.#onFlowUpdateCallbacks.length) {
      this.#onFlowUpdateCallbacks.forEach((cb) => cb(this.#flowName))
    }

    if (this.#onScreenUpdateCallbacks.length) {
      this.#onScreenUpdateCallbacks.forEach((cb) => cb(this.#currentScreen))
    }

    return this.#currentScreen
  }
}
