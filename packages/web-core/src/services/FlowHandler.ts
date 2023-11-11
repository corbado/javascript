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
  public onScreenUpdate: ((screen: ScreenNames) => void) | null = null;
  public onFlowUpdate: ((flow: FlowNames) => void) | null = null;

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

    if (this.onScreenUpdate) {
      this.onScreenUpdate(this.currentScreen);
    }

    return nextScreen;
  }

  navigateBack() {
    if (!this.screenHistory.length) {
      return CommonScreens.Start;
    }

    this.currentScreen = this.screenHistory.pop() || CommonScreens.Start;

    if (this.onScreenUpdate) {
      this.onScreenUpdate(this.currentScreen);
    }

    return this.currentScreen;
  }

  changeFlow(flowName: FlowNames) {
    this.flowName = flowName;
    this.currentFlow = flows[this.flowName];
    this.currentScreen = CommonScreens.Start;
    this.screenHistory = [];

    if (this.onFlowUpdate) {
      this.onFlowUpdate(this.flowName);
    }

    if (this.onScreenUpdate) {
      this.onScreenUpdate(this.currentScreen);
    }

    return this.currentScreen;
  }
}
