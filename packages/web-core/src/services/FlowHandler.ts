import type { ProjectConfigRspAllOfData } from "../api/models";
import type { StepFunction, StepFunctionParams } from "../types";
import { flows } from "../utils/flows";

export class FlowHandler {
  private currentFlow: Record<string, StepFunction>;
  private currentScreen: string;
  private screenHistory: string[];

  constructor(
    flowName:
      | "PasskeySignupWithEmailOTPFallback"
      | "EmailOTPSignup"
      | "PasskeyLoginWithEmailOTPFallback",
    private projectConfig: ProjectConfigRspAllOfData
  ) {
    this.currentFlow = flows[flowName];
    this.screenHistory = [];
    this.currentScreen = Object.keys(this.currentFlow)[0];
  }

  navigateToNextScreen(...userInputs: StepFunctionParams[]) {
    const stepFunction = this.currentFlow[this.currentScreen];
    if (stepFunction) {
      const nextScreen = stepFunction(this.projectConfig, ...userInputs);
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
