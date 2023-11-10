import type { Flow, StepFunctionParams } from "../../types";
import { EmailOtpSignupScreens } from "../../utils/constants/flowHandler";
import { canUsePasskeys } from "../helpers/webAuthUtils";

export interface IEmailSignupPasskeyBenefitsScreen extends StepFunctionParams {
  maybeLater?: boolean;
  appendSuccessful?: boolean;
  appendFailed?: boolean;
}
export interface IEmailSignupPasskeyOptionScreen
  extends StepFunctionParams,
    IEmailSignupPasskeyBenefitsScreen {
  showBenefits?: boolean;
}

export interface IEmailSignupPasskeyErrorScreen extends StepFunctionParams {
  success?: boolean;
  cancel?: boolean;
}

export const EmailOTPSignupFlow: Flow = {
  [EmailOtpSignupScreens.Start]: () => EmailOtpSignupScreens.EnterOtp,
  [EmailOtpSignupScreens.EnterOtp]: async (_, flowConfig) => {
    if (flowConfig.passkeyAppend) {
      const isPasskeySupported = await canUsePasskeys();
      return isPasskeySupported
        ? EmailOtpSignupScreens.PasskeyOption
        : EmailOtpSignupScreens.End;
    }
    return EmailOtpSignupScreens.End;
  },
  [EmailOtpSignupScreens.PasskeyOption]: (
    _,
    flowConfig,
    userInput: IEmailSignupPasskeyOptionScreen
  ) => {
    let result = EmailOtpSignupScreens.End;
    if (userInput.showBenefits) {
      result = EmailOtpSignupScreens.PasskeyBenefits;
    } else if (userInput.maybeLater) {
      result = EmailOtpSignupScreens.End;
    } else if (userInput.appendSuccessful) {
      result = EmailOtpSignupScreens.PasskeyWelcome;
    } else if (userInput.appendFailed) {
      result = flowConfig.retryPasskeyOnError
        ? EmailOtpSignupScreens.PasskeyError
        : EmailOtpSignupScreens.End;
    }
    return result;
  },
  [EmailOtpSignupScreens.PasskeyBenefits]: (
    _,
    flowConfig,
    userInput: IEmailSignupPasskeyBenefitsScreen
  ) => {
    let result = EmailOtpSignupScreens.End;

    if (userInput.maybeLater) {
      result = EmailOtpSignupScreens.End;
    } else if (userInput.appendSuccessful) {
      result = EmailOtpSignupScreens.PasskeyWelcome;
    } else if (userInput.appendFailed) {
      result = flowConfig.retryPasskeyOnError
        ? EmailOtpSignupScreens.PasskeyError
        : EmailOtpSignupScreens.End;
    }
    return result;
  },
  [EmailOtpSignupScreens.PasskeyWelcome]: () => EmailOtpSignupScreens.End,
  [EmailOtpSignupScreens.PasskeyError]: (
    _,
    __,
    userInput: IEmailSignupPasskeyErrorScreen
  ) => {
    return userInput.success
      ? EmailOtpSignupScreens.PasskeyWelcome
      : EmailOtpSignupScreens.End;
  },
};
