import type {Flow,} from "../../types";
import {EmailOtpSignupScreens} from "../constants";
import {canUsePasskeys} from "../helpers";

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
    __,
    ___?: string
  ) => {
    return EmailOtpSignupScreens.End;
  },
  [EmailOtpSignupScreens.PasskeyBenefits]: (
    _,
    __,
    ___?: string
  ) => {
    return EmailOtpSignupScreens.End;

  },
  [EmailOtpSignupScreens.PasskeyWelcome]: () => EmailOtpSignupScreens.End,
  [EmailOtpSignupScreens.PasskeyError]: (
    _,
    __,
    ___?: string
  ) => {
    return EmailOtpSignupScreens.End;
  },
};
