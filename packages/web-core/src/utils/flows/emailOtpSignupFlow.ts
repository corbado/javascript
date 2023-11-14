import type {
  Flow,
  ISignupPasskeyAppendScreen,
  ISignupPasskeyBenefitsScreen,
  ISignupPasskeyErrorScreen,
} from "../../types";
import { EmailOtpSignupScreens } from "../../utils/constants/flowHandler";
import { canUsePasskeys } from "../helpers/webAuthUtils";

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
    userInput: ISignupPasskeyAppendScreen
  ) => {
    let result = EmailOtpSignupScreens.End;

    if (userInput.showBenefits) {
      result = EmailOtpSignupScreens.PasskeyBenefits;
    } else if (userInput.success) {
      result = EmailOtpSignupScreens.PasskeyWelcome;
    } else if (userInput.failure) {
      result = flowConfig.retryPasskeyOnError
        ? EmailOtpSignupScreens.PasskeyError
        : EmailOtpSignupScreens.End;
    }

    return result;
  },
  [EmailOtpSignupScreens.PasskeyBenefits]: (
    _,
    flowConfig,
    userInput: ISignupPasskeyBenefitsScreen
  ) => {
    let result = EmailOtpSignupScreens.End;

    if (userInput.success) {
      result = EmailOtpSignupScreens.PasskeyWelcome;
    } else if (userInput.failure) {
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
    userInput: ISignupPasskeyErrorScreen
  ) => {
    return userInput.success
      ? EmailOtpSignupScreens.PasskeyWelcome
      : EmailOtpSignupScreens.End;
  },
};
