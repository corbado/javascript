import type { Flow, StepFunctionParams } from "../../types";

export interface IPasskeyLoginErrorScreen extends StepFunctionParams {
  success?: boolean;
  cancel?: boolean;
}

export interface IPasskeyLoginScreen
  extends IPasskeyLoginErrorScreen,
    StepFunctionParams {
  enterOtp?: boolean;
}

export interface IPasskeyLoginPasskeyAppendScreen
  extends StepFunctionParams,
    IPasskeyLoginErrorScreen {
  maybeLater?: boolean;
}

export const PasskeyLoginWithEmailOTPFallbackFlow: Flow = {};
