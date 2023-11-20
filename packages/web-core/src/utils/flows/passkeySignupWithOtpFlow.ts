import type { Flow } from '../../types';
import type { PasskeySignupWithEmailOtpFallbackOptions } from '../../types';
import { PasskeySignupWithEmailOtpFallbackScreens } from '../constants';
import { canUsePasskeys } from '../helpers';

// TODO: Update step functions
export const PasskeySignupWithEmailOTPFallbackFlow: Flow = {
  [PasskeySignupWithEmailOtpFallbackScreens.Start]: async () => {
    const isPasskeySupported = await canUsePasskeys();
    return isPasskeySupported
      ? PasskeySignupWithEmailOtpFallbackScreens.CreatePasskey
      : PasskeySignupWithEmailOtpFallbackScreens.EnterOtp;
  },
  [PasskeySignupWithEmailOtpFallbackScreens.CreatePasskey]: (
    flowOptions: PasskeySignupWithEmailOtpFallbackOptions,
    event?: string,
  ) => {
    switch (event) {
      case 'click_show_benefits':
        return PasskeySignupWithEmailOtpFallbackScreens.PasskeyBenefits;
      case 'click_email_otp':
        return PasskeySignupWithEmailOtpFallbackScreens.EnterOtp;
      case 'passkey_success':
        return PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome;
      case 'passkey_error':
        if (flowOptions.retryPasskeyOnError) {
          return PasskeySignupWithEmailOtpFallbackScreens.PasskeyError;
        } else {
          return PasskeySignupWithEmailOtpFallbackScreens.EnterOtp;
        }
      default:
        return PasskeySignupWithEmailOtpFallbackScreens.CreatePasskey;
    }
  },
  [PasskeySignupWithEmailOtpFallbackScreens.EnterOtp]: async (
    flowOptions: PasskeySignupWithEmailOtpFallbackOptions,
    _?: string,
  ) => {
    if (flowOptions.passkeyAppend) {
      const isPasskeySupported = await canUsePasskeys();
      return isPasskeySupported
        ? PasskeySignupWithEmailOtpFallbackScreens.PasskeyAppend
        : PasskeySignupWithEmailOtpFallbackScreens.End;
    }

    return PasskeySignupWithEmailOtpFallbackScreens.End;
  },
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyAppend]: (_, event?: string) => {
    switch (event) {
      case 'click_show_benefits':
        return PasskeySignupWithEmailOtpFallbackScreens.PasskeyBenefits;
      case 'success':
        return PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome;
      default:
        return PasskeySignupWithEmailOtpFallbackScreens.PasskeyAppend;
    }
  },
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyBenefits]: (
    flowOptions: PasskeySignupWithEmailOtpFallbackOptions,
    event?: string,
  ) => {
    switch (event) {
      case 'passkey_success':
        return PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome;
      case 'passkey_error':
        if (flowOptions.retryPasskeyOnError) {
          return PasskeySignupWithEmailOtpFallbackScreens.PasskeyError;
        } else {
          return PasskeySignupWithEmailOtpFallbackScreens.EnterOtp;
        }
      default:
        return PasskeySignupWithEmailOtpFallbackScreens.PasskeyBenefits;
    }
  },
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome]: () => PasskeySignupWithEmailOtpFallbackScreens.End,
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyError]: (_, __?: string) => {
    return PasskeySignupWithEmailOtpFallbackScreens.End;
  },
};
