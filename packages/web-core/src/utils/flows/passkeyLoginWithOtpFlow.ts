import type {Flow} from "../../types";
import {PasskeyLoginWithEmailOtpFallbackScreens} from "../constants";

export const PasskeyLoginWithEmailOTPFallbackFlow: Flow = {
    [PasskeyLoginWithEmailOtpFallbackScreens.Start]: (
        _,
        __,
        ___?: string
    ) => {
        return PasskeyLoginWithEmailOtpFallbackScreens.End
    },
    [PasskeyLoginWithEmailOtpFallbackScreens.EnterOtp]: async (
        _,
        __,
        ___?: string
    ) => {
        return PasskeyLoginWithEmailOtpFallbackScreens.End
    },
    [PasskeyLoginWithEmailOtpFallbackScreens.PasskeyAppend]: (
        _,
        __,
        ___?: string
    ) => {
        return PasskeyLoginWithEmailOtpFallbackScreens.End
    },
    [PasskeyLoginWithEmailOtpFallbackScreens.PasskeyError]: (
        _,
        __,
        ___?: string
    ) => {
        return PasskeyLoginWithEmailOtpFallbackScreens.End
    },
};
