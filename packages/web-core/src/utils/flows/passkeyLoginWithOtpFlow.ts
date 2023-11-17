import type {
  Flow,
  ILoginEmailOtpScreen,
  ILoginInitScreen,
  ILoginPasskeyAppendScreen,
  ILoginPasskeyErrorScreen,
} from "../../types/flowHandler";
import { PasskeyLoginWithEmailOtpFallbackScreens } from "../constants/flowHandler";
import { canUsePasskeys } from "../helpers/webAuthUtils";

export const PasskeyLoginWithEmailOTPFallbackFlow: Flow = {
  [PasskeyLoginWithEmailOtpFallbackScreens.Start]: (
    _,
    flowConfig,
    userInput: ILoginInitScreen
  ) => {
    let result = PasskeyLoginWithEmailOtpFallbackScreens.End;

    if (userInput.sendOtpEmail) {
      result = PasskeyLoginWithEmailOtpFallbackScreens.EnterOtp;
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
    userInput: ILoginEmailOtpScreen
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
    userInput: ILoginPasskeyAppendScreen
  ) => {
    let result = PasskeyLoginWithEmailOtpFallbackScreens.End;

    if (userInput.failure) {
      result = flowConfig.retryPasskeyOnError
        ? PasskeyLoginWithEmailOtpFallbackScreens.PasskeyError
        : PasskeyLoginWithEmailOtpFallbackScreens.End;
    }

    return result;
  },
  [PasskeyLoginWithEmailOtpFallbackScreens.PasskeyError]: (
    _,
    __,
    userInput: ILoginPasskeyErrorScreen
  ) => {
    let result = PasskeyLoginWithEmailOtpFallbackScreens.End;

    if (userInput.cancel) {
      result = userInput.isUserAuthenticated
        ? PasskeyLoginWithEmailOtpFallbackScreens.End
        : PasskeyLoginWithEmailOtpFallbackScreens.EnterOtp;
    } else if (userInput.sendOtpEmail && !userInput.isUserAuthenticated) {
      result = PasskeyLoginWithEmailOtpFallbackScreens.EnterOtp;
    }

    return result;
  },
};
