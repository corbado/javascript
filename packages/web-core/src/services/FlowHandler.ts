import type { ProjectConfigRspAllOfData } from "../api/models";
import type {
  FlowNames,
  IFlowHandlerConfig,
  StepFunction,
  StepFunctionParams,
} from "../types";
import { flows } from "../utils/flows";

export class FlowHandlerService {
  private currentFlow: Record<string, StepFunction>;
  private currentScreen: string;
  private screenHistory: string[];

  constructor(
    private flowName: FlowNames,
    private projectConfig: ProjectConfigRspAllOfData,
    private flowHandlerConfig: IFlowHandlerConfig
  ) {
    this.currentFlow = flows[this.flowName];
    this.screenHistory = [];
    this.currentScreen = "start";
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

    if (nextScreen === "end") {
      void this.redirect();
      return "end";
    }

    this.screenHistory.push(this.currentScreen);
    this.currentScreen = nextScreen;
    return nextScreen;
  }

  navigateBack() {
    if (!this.screenHistory.length) {
      return "start";
    }

    this.currentScreen = this.screenHistory.pop() || "start";
    return this.currentScreen;
  }
}
