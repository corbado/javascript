import type { Flow, StepFunctionParams } from "../../types/flowHandler";
import { PasskeyLoginWithEmailOtpFallbackScreens } from "../constants/flowHandler";
import { canUsePasskeys } from "../helpers/webAuthUtils";

export interface BaseScreenParams extends StepFunctionParams {
  success?: boolean;
  failure?: boolean;
}

export interface IPasskeyLoginScreen
  extends BaseScreenParams,
    StepFunctionParams {
  enterOtp?: boolean;
}

export interface IPasskeyLoginPasskeyAppendScreen
  extends StepFunctionParams,
    BaseScreenParams {
  maybeLater?: boolean;
}

export interface IPasskeyLoginErrorScreen
  extends StepFunctionParams,
    BaseScreenParams {
  isUserAuthenticated?: boolean;
  sendOtp?: boolean;
}

export interface IPasskeyLoginEmailOtpScreen extends StepFunctionParams {
  userHasPasskey?: boolean;
}

export const PasskeyLoginWithEmailOTPFallbackFlow: Flow = {
  [PasskeyLoginWithEmailOtpFallbackScreens.Start]: (
    _,
    flowConfig,
    userInput: IPasskeyLoginScreen
  ) => {
    let result = PasskeyLoginWithEmailOtpFallbackScreens.End;
    if (userInput.enterOtp) {
      result = PasskeyLoginWithEmailOtpFallbackScreens.EnterOtp;
    } else if (userInput.success) {
      result = PasskeyLoginWithEmailOtpFallbackScreens.End;
    } else if (userInput.failure) {
      result = flowConfig.retryPasskeyOnError
        ? PasskeyLoginWithEmailOtpFallbackScreens.PasskeyError
        : PasskeyLoginWithEmailOtpFallbackScreens.EnterOtp;
    }
    return result;
  },
  [PasskeyLoginWithEmailOtpFallbackScreens.EnterOtp]: async (
    _,
    flowConfig,
    userInput: IPasskeyLoginEmailOtpScreen
  ) => {
    const isPasskeySupported = await canUsePasskeys();

    if (
      flowConfig.passkeyAppend &&
      isPasskeySupported &&
      !userInput.userHasPasskey
    ) {
      return PasskeyLoginWithEmailOtpFallbackScreens.PasskeyAppend;
    }

    return PasskeyLoginWithEmailOtpFallbackScreens.End;
  },
  [PasskeyLoginWithEmailOtpFallbackScreens.PasskeyAppend]: (
    _,
    flowConfig,
    userInput: IPasskeyLoginPasskeyAppendScreen
  ) => {
    let result = PasskeyLoginWithEmailOtpFallbackScreens.End;
    if (userInput.maybeLater) {
      result = PasskeyLoginWithEmailOtpFallbackScreens.End;
    } else if (userInput.success) {
      result = PasskeyLoginWithEmailOtpFallbackScreens.End;
    } else if (userInput.failure) {
      result = flowConfig.retryPasskeyOnError
        ? PasskeyLoginWithEmailOtpFallbackScreens.PasskeyError
        : PasskeyLoginWithEmailOtpFallbackScreens.End;
    }
    return result;
  },
  [PasskeyLoginWithEmailOtpFallbackScreens.PasskeyError]: (
    _,
    __,
    userInput: IPasskeyLoginErrorScreen
  ) => {
    let result = PasskeyLoginWithEmailOtpFallbackScreens.End;
    if (userInput.failure) {
      result = userInput.isUserAuthenticated
        ? PasskeyLoginWithEmailOtpFallbackScreens.End
        : PasskeyLoginWithEmailOtpFallbackScreens.EnterOtp;
    } else if (userInput.sendOtp && !userInput.isUserAuthenticated) {
      result = PasskeyLoginWithEmailOtpFallbackScreens.EnterOtp;
    }
    return result;
  },
};
