import type {Flow} from "../../types";
import {PasskeyLoginWithEmailOtpFallbackScreens} from "../constants";

// TODO: Update step functions
export const PasskeyLoginWithEmailOTPFallbackFlow: Flow = {
  [PasskeyLoginWithEmailOtpFallbackScreens.Start]: (
    _,
    __?: string
  ) => {
    return PasskeyLoginWithEmailOtpFallbackScreens.End
  },
  [PasskeyLoginWithEmailOtpFallbackScreens.EnterOtp]: async (
    _,
    __?: string
  ) => {
    return PasskeyLoginWithEmailOtpFallbackScreens.End
  },
  [PasskeyLoginWithEmailOtpFallbackScreens.PasskeyAppend]: (
    _,
    __?: string
  ) => {
    return PasskeyLoginWithEmailOtpFallbackScreens.End
  },
  [PasskeyLoginWithEmailOtpFallbackScreens.PasskeyError]: (
    _,
    __?: string
  ) => {
    return PasskeyLoginWithEmailOtpFallbackScreens.End
  },
};
