import type {
  Flow,
  ISignupPasskeyAppendScreen,
  ISignupPasskeyBenefitsScreen,
  ISignupPasskeyCreateScreen,
  ISignupPasskeyErrorScreen,
} from "../../types";
import { PasskeySignupWithEmailOtpFallbackScreens } from "../constants";
import { canUsePasskeys } from "../helpers/webAuthUtils";

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
    userInput: ISignupPasskeyCreateScreen
  ) => {
    let result = PasskeySignupWithEmailOtpFallbackScreens.End;

    if (userInput.showBenefits) {
      result = PasskeySignupWithEmailOtpFallbackScreens.PasskeyBenefits;
    } else if (userInput.success) {
      result = PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome;
    } else if (userInput.failure) {
      result = flowConfig.retryPasskeyOnError
        ? PasskeySignupWithEmailOtpFallbackScreens.PasskeyError
        : PasskeySignupWithEmailOtpFallbackScreens.EnterOtp;
    } else if (userInput.sendOtpEmail) {
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
    userInput: ISignupPasskeyAppendScreen
  ) => {
    let result = PasskeySignupWithEmailOtpFallbackScreens.End;

    if (userInput.showBenefits) {
      result = PasskeySignupWithEmailOtpFallbackScreens.PasskeyBenefits;
    } else if (userInput.success) {
      result = PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome;
    } else if (userInput.failure) {
      result = flowConfig.retryPasskeyOnError
        ? PasskeySignupWithEmailOtpFallbackScreens.PasskeyError
        : PasskeySignupWithEmailOtpFallbackScreens.End;
    }

    return result;
  },
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyBenefits]: (
    _,
    flowConfig,
    userInput: ISignupPasskeyBenefitsScreen
  ) => {
    let result = PasskeySignupWithEmailOtpFallbackScreens.End;

    if (userInput.maybeLater) {
      result = userInput.isUserAuthenticated
        ? PasskeySignupWithEmailOtpFallbackScreens.End
        : PasskeySignupWithEmailOtpFallbackScreens.EnterOtp;
    } else if (userInput.success) {
      result = PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome;
    } else if (userInput.failure) {
      result = flowConfig.retryPasskeyOnError
        ? PasskeySignupWithEmailOtpFallbackScreens.PasskeyError
        : userInput.isUserAuthenticated
        ? PasskeySignupWithEmailOtpFallbackScreens.End
        : PasskeySignupWithEmailOtpFallbackScreens.EnterOtp;
    }

    return result;
  },
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome]: () =>
    PasskeySignupWithEmailOtpFallbackScreens.End,
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyError]: (
    _,
    __,
    userInput: ISignupPasskeyErrorScreen
  ) => {
    let result = PasskeySignupWithEmailOtpFallbackScreens.End;

    if (userInput.success) {
      result = PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome;
    } else if (
      userInput.sendOtpEmail ||
      (userInput.cancel && !userInput.isUserAuthenticated)
    ) {
      result = PasskeySignupWithEmailOtpFallbackScreens.EnterOtp;
    }

    return result;
  },
};
