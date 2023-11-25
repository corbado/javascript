import type { Flow } from '../../types';
import { FlowHandlerEvents, PasskeySignupWithEmailOtpFallbackScreens } from '../constants';
import { canUsePasskeys } from '../helpers/webAuthUtils';

export const PasskeySignupWithEmailOTPFallbackFlow: Flow = {
  [PasskeySignupWithEmailOtpFallbackScreens.Start]: async () => {
    const isPasskeySupported = await canUsePasskeys();
    return isPasskeySupported
      ? PasskeySignupWithEmailOtpFallbackScreens.CreatePasskey
      : PasskeySignupWithEmailOtpFallbackScreens.EnterOtp;
  },
  [PasskeySignupWithEmailOtpFallbackScreens.CreatePasskey]: (flowOptions, event) => {
    switch (event) {
      case FlowHandlerEvents.ShowBenefits:
        return PasskeySignupWithEmailOtpFallbackScreens.PasskeyBenefits;
      case FlowHandlerEvents.EmailOtp:
        return PasskeySignupWithEmailOtpFallbackScreens.EnterOtp;
      case FlowHandlerEvents.PasskeySuccess:
        return PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome;
      case FlowHandlerEvents.PasskeyError:
        if (flowOptions?.retryPasskeyOnError) {
          return PasskeySignupWithEmailOtpFallbackScreens.PasskeyError;
        }

        return PasskeySignupWithEmailOtpFallbackScreens.EnterOtp;
      default:
        return PasskeySignupWithEmailOtpFallbackScreens.CreatePasskey;
    }
  },
  [PasskeySignupWithEmailOtpFallbackScreens.EnterOtp]: async flowOptions => {
    if (flowOptions?.passkeyAppend) {
      const isPasskeySupported = await canUsePasskeys();
      return isPasskeySupported
        ? PasskeySignupWithEmailOtpFallbackScreens.PasskeyAppend
        : PasskeySignupWithEmailOtpFallbackScreens.End;
    }

    return PasskeySignupWithEmailOtpFallbackScreens.End;
  },
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyAppend]: (flowOptions, event) => {
    switch (event) {
      case FlowHandlerEvents.ShowBenefits:
        return PasskeySignupWithEmailOtpFallbackScreens.PasskeyBenefits;
      case FlowHandlerEvents.PasskeySuccess:
        return PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome;
      case FlowHandlerEvents.PasskeyError:
        if (flowOptions?.retryPasskeyOnError) {
          return PasskeySignupWithEmailOtpFallbackScreens.PasskeyError;
        }

        return PasskeySignupWithEmailOtpFallbackScreens.End;
      default:
        return PasskeySignupWithEmailOtpFallbackScreens.End;
    }
  },
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyBenefits]: (flowOptions, event, eventOptions) => {
    switch (event) {
      case FlowHandlerEvents.PasskeySuccess:
        return PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome;
      case FlowHandlerEvents.PasskeyError:
        if (flowOptions?.retryPasskeyOnError) {
          return PasskeySignupWithEmailOtpFallbackScreens.PasskeyError;
        }

        if (eventOptions?.isUserAuthenticated) {
          return PasskeySignupWithEmailOtpFallbackScreens.End;
        }

        return PasskeySignupWithEmailOtpFallbackScreens.EnterOtp;
      case FlowHandlerEvents.MaybeLater:
        if (eventOptions?.isUserAuthenticated) {
          return PasskeySignupWithEmailOtpFallbackScreens.End;
        }

        return PasskeySignupWithEmailOtpFallbackScreens.EnterOtp;
      default:
        return PasskeySignupWithEmailOtpFallbackScreens.End;
    }
  },
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome]: () => PasskeySignupWithEmailOtpFallbackScreens.End,
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyError]: (_, event, eventOptions) => {
    switch (event) {
      case FlowHandlerEvents.EmailOtp:
        if (eventOptions?.isUserAuthenticated) {
          return PasskeySignupWithEmailOtpFallbackScreens.End;
        }

        return PasskeySignupWithEmailOtpFallbackScreens.EnterOtp;
      case FlowHandlerEvents.CancelPasskey:
        if (eventOptions?.isUserAuthenticated) {
          return PasskeySignupWithEmailOtpFallbackScreens.End;
        }

        return PasskeySignupWithEmailOtpFallbackScreens.EnterOtp;
      default:
        return PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome;
    }
  },
};
