import type {Flow} from "../../types";
import {PasskeySignupWithEmailOtpFallbackScreens} from "../constants";
import {canUsePasskeys} from "../helpers";

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
        event?: string
    ) => {
        switch (event) {
            case 'click_show_benefits':
                return PasskeySignupWithEmailOtpFallbackScreens.PasskeyBenefits
            case 'click_email_otp':
                return PasskeySignupWithEmailOtpFallbackScreens.EnterOtp
            case 'passkey_success':
                return PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome
            case 'passkey_error':
                if (flowConfig.retryPasskeyOnError) {
                    return PasskeySignupWithEmailOtpFallbackScreens.PasskeyError
                } else {
                    return PasskeySignupWithEmailOtpFallbackScreens.EnterOtp
                }
            default:
                return PasskeySignupWithEmailOtpFallbackScreens.CreatePasskey
        }
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
        __,
        event?: string
    ) => {
        switch (event) {
            case 'click_show_benefits':
                return PasskeySignupWithEmailOtpFallbackScreens.PasskeyBenefits
            case 'success':
                return PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome
            default:
                return PasskeySignupWithEmailOtpFallbackScreens.PasskeyAppend
        }
    },
    [PasskeySignupWithEmailOtpFallbackScreens.PasskeyBenefits]: (
        _,
        flowConfig,
        event?: string
    ) => {
      switch (event) {
        case 'passkey_success':
          return PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome
        case 'passkey_error':
          if (flowConfig.retryPasskeyOnError) {
            return PasskeySignupWithEmailOtpFallbackScreens.PasskeyError
          } else {
            return PasskeySignupWithEmailOtpFallbackScreens.EnterOtp
          }
        default:
          return PasskeySignupWithEmailOtpFallbackScreens.PasskeyBenefits
      }
    },
    [PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome]: () =>
        PasskeySignupWithEmailOtpFallbackScreens.End,
    [PasskeySignupWithEmailOtpFallbackScreens.PasskeyError]: (
        _,
        __,
        ___?: string
    ) => {
        return PasskeySignupWithEmailOtpFallbackScreens.End
    },
};
