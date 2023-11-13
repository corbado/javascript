import type {
  Flow,
  FlowNames,
  IFlowHandlerConfig,
  IProjectConfig,
  ScreenNames,
  StepFunctionParams,
} from "../types";
import { CommonScreens } from "../utils/constants/flowHandler";
import { flows } from "../utils/flows";

export class FlowHandlerService {
  private currentFlow: Flow;
  private currentScreen: ScreenNames;
  private screenHistory: ScreenNames[];
  private onScreenUpdateCallbacks: Array<(screen: ScreenNames) => void> = [];
  private onFlowUpdateCallbacks: Array<(flow: FlowNames) => void> = [];

  constructor(
    private flowName: FlowNames,
    private projectConfig: IProjectConfig,
    private flowHandlerConfig: IFlowHandlerConfig
  ) {
    this.currentFlow = flows[this.flowName];
    this.screenHistory = [];
    this.currentScreen = CommonScreens.Start;
  }

  get currentScreenName() {
    return this.currentScreen;
  }

  get currentFlowName() {
    return this.flowName;
  }

  onScreenUpdate(cb: (screen: ScreenNames) => void) {
    this.onScreenUpdateCallbacks.push(cb);
  }

  onFlowUpdate(cb: (flow: FlowNames) => void) {
    this.onFlowUpdateCallbacks.push(cb);
  }

  redirect() {
    //window.location.href = this.projectConfig.redirectUrl;
  }

  async navigateToNextScreen(userInput: StepFunctionParams) {
    const stepFunction = this.currentFlow[this.currentScreen];
    if (!stepFunction) {
      throw new Error("Invalid screen");
    }

    const nextScreen = await stepFunction(
      this.projectConfig,
      this.flowHandlerConfig,
      userInput
    );

    if (nextScreen === CommonScreens.End) {
      void this.redirect();
    }

    this.screenHistory.push(this.currentScreen);
    this.currentScreen = nextScreen;

    if (this.onScreenUpdateCallbacks.length) {
      this.onScreenUpdateCallbacks.forEach((cb) => cb(this.currentScreen));
    }

    return nextScreen;
  }

  navigateBack() {
    if (!this.screenHistory.length) {
      return CommonScreens.Start;
    }

    this.currentScreen = this.screenHistory.pop() || CommonScreens.Start;

    if (this.onScreenUpdateCallbacks.length) {
      this.onScreenUpdateCallbacks.forEach((cb) => cb(this.currentScreen));
    }

    return this.currentScreen;
  }

  changeFlow(flowName: FlowNames) {
    this.flowName = flowName;
    this.currentFlow = flows[this.flowName];
    this.currentScreen = CommonScreens.Start;
    this.screenHistory = [];

    if (this.onFlowUpdateCallbacks.length) {
      this.onFlowUpdateCallbacks.forEach((cb) => cb(this.flowName));
    }

    if (this.onScreenUpdateCallbacks.length) {
      this.onScreenUpdateCallbacks.forEach((cb) => cb(this.currentScreen));
    }

    return this.currentScreen;
  }
}
