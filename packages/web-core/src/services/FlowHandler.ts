import type {
  Flow,
  FlowNames,
  IFlowHandlerConfig,
  IProjectConfig,
  ScreenNames,
  StepFunctionParams,
} from "../types";
import { CommonScreens } from "../types";
import { flows } from "../utils/flows";

export class FlowHandlerService {
  private currentFlow: Flow;
  private currentScreen: ScreenNames;
  private screenHistory: ScreenNames[];

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

  redirect() {
    //window.location.href = this.projectConfig.redirectUrl;
  }

  navigateToNextScreen(...userInputs: StepFunctionParams[]) {
    const stepFunction = this.currentFlow[this.currentScreen];
    if (!stepFunction) {
      throw new Error("Invalid screen");
    }

    const nextScreen = stepFunction(
      this.projectConfig,
      this.flowHandlerConfig,
      ...userInputs
    );

    if (nextScreen === CommonScreens.End) {
      void this.redirect();
    }

    this.screenHistory.push(this.currentScreen);
    this.currentScreen = nextScreen;
    return nextScreen;
  }

  navigateBack() {
    if (!this.screenHistory.length) {
      return CommonScreens.Start;
    }

    this.currentScreen = this.screenHistory.pop() || CommonScreens.Start;
    return this.currentScreen;
  }
}
