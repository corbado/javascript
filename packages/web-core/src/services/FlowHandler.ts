import type { ProjectConfigRspAllOfData } from "../api/models";
import type {
  FlowNames,
  IFlowHandlerConfig,
  StepFunction,
  StepFunctionParams,
} from "../types";
import { flows } from "../utils/flows";

export class FlowHandler {
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
    this.currentScreen = Object.keys(this.currentFlow)[0];
  }

  navigateToNextScreen(...userInputs: StepFunctionParams[]) {
    const stepFunction = this.currentFlow[this.currentScreen];
    if (stepFunction) {
      const nextScreen = stepFunction(
        this.projectConfig,
        this.flowHandlerConfig,
        ...userInputs
      );
      if (nextScreen) {
        this.screenHistory.push(this.currentScreen);
        this.currentScreen = nextScreen;
      }
    }
  }

  navigateBack() {
    if (this.screenHistory.length > 0) {
      this.currentScreen =
        this.screenHistory.pop() ?? Object.keys(this.currentFlow)[0];
    }
  }
}
