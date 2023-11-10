import type { Flow, StepFunctionParams } from "../../types";
import { PasskeySignupWithEmailOtpFallbackScreens } from "../constants";
import { canUsePasskeys } from "../helpers/webAuthUtils";

export interface IPasskeySignupCreatePasskeyScreen extends StepFunctionParams {
  showBenefits?: boolean;
  createSuccessful?: boolean;
  createFailed?: boolean;
  enterOtp?: boolean;
}

export interface IPasskeySignupPasskeyBenefitsScreen
  extends StepFunctionParams {
  maybeLater?: boolean;
  successful?: boolean;
  failed?: boolean;
}
export interface IPasskeySignupPasskeyAppendScreen
  extends StepFunctionParams,
    IPasskeySignupPasskeyBenefitsScreen {
  showBenefits?: boolean;
}

export interface IPasskeyErrorScreen extends StepFunctionParams {
  success?: boolean;
  cancel?: boolean;
}

export const PasskeySignupWithEmailOTPFallbackFlow: Flow = {
  [PasskeySignupWithEmailOtpFallbackScreens.Start]: async () => {
    const isPasskeySupported = await canUsePasskeys();
    return isPasskeySupported
      ? PasskeySignupWithEmailOtpFallbackScreens.CreatePasskey
      : PasskeySignupWithEmailOtpFallbackScreens.EnterOtp;
  },
  [PasskeySignupWithEmailOtpFallbackScreens.CreatePasskey]: (
    _,
    flowConfig,
    userInput: IPasskeySignupCreatePasskeyScreen
  ) => {
    let result = PasskeySignupWithEmailOtpFallbackScreens.End;
    if (userInput.showBenefits) {
      result = PasskeySignupWithEmailOtpFallbackScreens.PasskeyBenefits;
    } else if (userInput.createSuccessful) {
      result = PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome;
    } else if (userInput.createFailed) {
      result = flowConfig.retryPasskeyOnError
        ? PasskeySignupWithEmailOtpFallbackScreens.PasskeyError
        : PasskeySignupWithEmailOtpFallbackScreens.End;
    } else if (userInput.enterOtp) {
      result = PasskeySignupWithEmailOtpFallbackScreens.EnterOtp;
    }
    return result;
  },
  [PasskeySignupWithEmailOtpFallbackScreens.EnterOtp]: async (
    _,
    flowConfig
  ) => {
    if (flowConfig.passkeyAppend) {
      const isPasskeySupported = await canUsePasskeys();
      return isPasskeySupported
        ? PasskeySignupWithEmailOtpFallbackScreens.PasskeyAppend
        : PasskeySignupWithEmailOtpFallbackScreens.End;
    }
    return PasskeySignupWithEmailOtpFallbackScreens.End;
  },
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyAppend]: (
    _,
    flowConfig,
    userInput: IPasskeySignupPasskeyAppendScreen
  ) => {
    let result = PasskeySignupWithEmailOtpFallbackScreens.End;
    if (userInput.showBenefits) {
      result = PasskeySignupWithEmailOtpFallbackScreens.PasskeyBenefits;
    } else if (userInput.maybeLater) {
      result = PasskeySignupWithEmailOtpFallbackScreens.End;
    } else if (userInput.successful) {
      result = PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome;
    } else if (userInput.failed) {
      result = flowConfig.retryPasskeyOnError
        ? PasskeySignupWithEmailOtpFallbackScreens.PasskeyError
        : PasskeySignupWithEmailOtpFallbackScreens.End;
    }
    return result;
  },
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyBenefits]: (
    _,
    flowConfig,
    userInput: IPasskeySignupPasskeyBenefitsScreen
  ) => {
    let result = PasskeySignupWithEmailOtpFallbackScreens.End;

    if (userInput.maybeLater) {
      result = PasskeySignupWithEmailOtpFallbackScreens.End;
    } else if (userInput.successful) {
      result = PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome;
    } else if (userInput.failed) {
      result = flowConfig.retryPasskeyOnError
        ? PasskeySignupWithEmailOtpFallbackScreens.PasskeyError
        : PasskeySignupWithEmailOtpFallbackScreens.End;
    }
    return result;
  },
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome]: () =>
    PasskeySignupWithEmailOtpFallbackScreens.End,
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyError]: (
    _,
    __,
    userInput: IPasskeyErrorScreen
  ) => {
    return userInput.success
      ? PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome
      : PasskeySignupWithEmailOtpFallbackScreens.End;
  },
};
