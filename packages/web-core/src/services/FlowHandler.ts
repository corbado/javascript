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
  private _currentFlow: Flow;
  private _currentScreen: ScreenNames;
  private _screenHistory: ScreenNames[];
  private _onScreenUpdateCallbacks: Array<(screen: ScreenNames) => void> = [];
  private _onFlowUpdateCallbacks: Array<(flow: FlowNames) => void> = [];

  constructor(
    private _flowName: FlowNames,
    private _projectConfig: IProjectConfig,
    private _flowHandlerConfig: IFlowHandlerConfig
  ) {
    this._currentFlow = flows[this._flowName];
    this._screenHistory = [];
    this._currentScreen = CommonScreens.Start;
  }

  get currentScreenName() {
    return this._currentScreen;
  }

  get currentFlowName() {
    return this._flowName;
  }

  onScreenChange(cb: (screen: ScreenNames) => void) {
    this._onScreenUpdateCallbacks.push(cb);
  }

  onFlowChange(cb: (flow: FlowNames) => void) {
    this._onFlowUpdateCallbacks.push(cb);
  }

  redirect() {
    //window.location.href = this._projectConfig.redirectUrl;
  }

  async navigateToNextScreen(userInput: StepFunctionParams) {
    const stepFunction = this._currentFlow[this._currentScreen];
    if (!stepFunction) {
      throw new Error("Invalid screen");
    }

    const nextScreen = await stepFunction(
      this._projectConfig,
      this._flowHandlerConfig,
      userInput
    );

    if (nextScreen === CommonScreens.End) {
      void this.redirect();
    }

    this._screenHistory.push(this._currentScreen);
    this._currentScreen = nextScreen;

    if (this._onScreenUpdateCallbacks.length) {
      this._onScreenUpdateCallbacks.forEach((cb) => cb(this._currentScreen));
    }

    return nextScreen;
  }

  navigateBack() {
    if (!this._screenHistory.length) {
      return CommonScreens.Start;
    }

    this._currentScreen = this._screenHistory.pop() || CommonScreens.Start;

    if (this._onScreenUpdateCallbacks.length) {
      this._onScreenUpdateCallbacks.forEach((cb) => cb(this._currentScreen));
    }

    return this._currentScreen;
  }

  changeFlow(flowName: FlowNames) {
    this._flowName = flowName;
    this._currentFlow = flows[this._flowName];
    this._currentScreen = CommonScreens.Start;
    this._screenHistory = [];

    if (this._onFlowUpdateCallbacks.length) {
      this._onFlowUpdateCallbacks.forEach((cb) => cb(this._flowName));
    }

    if (this._onScreenUpdateCallbacks.length) {
      this._onScreenUpdateCallbacks.forEach((cb) => cb(this._currentScreen));
    }

    return this._currentScreen;
  }
}
