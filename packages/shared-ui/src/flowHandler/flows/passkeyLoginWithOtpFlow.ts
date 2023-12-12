import { canUsePasskeys } from '../../utils/webAuthUtils';
import { FlowHandlerEvents, PasskeyLoginWithEmailOtpFallbackScreens } from '../constants';
import type { Flow } from '../types';

export const PasskeyLoginWithEmailOTPFallbackFlow: Flow = {
  [PasskeyLoginWithEmailOtpFallbackScreens.Start]: (flowOptions, event) => {
    switch (event) {
      case FlowHandlerEvents.EmailOtp:
        return PasskeyLoginWithEmailOtpFallbackScreens.EnterOtp;
      case FlowHandlerEvents.PasskeyError:
        if (flowOptions?.retryPasskeyOnError) {
          return PasskeyLoginWithEmailOtpFallbackScreens.PasskeyError;
        }

        return PasskeyLoginWithEmailOtpFallbackScreens.EnterOtp;
      default:
        return PasskeyLoginWithEmailOtpFallbackScreens.End;
    }
  },
  [PasskeyLoginWithEmailOtpFallbackScreens.EnterOtp]: async (flowOptions, event, eventOptions) => {
    if (event === FlowHandlerEvents.CancelOtp) {
      return PasskeyLoginWithEmailOtpFallbackScreens.Start;
    }

    const isPasskeySupported = await canUsePasskeys();

    if (flowOptions?.passkeyAppend && isPasskeySupported && !eventOptions?.userHasPasskey) {
      return PasskeyLoginWithEmailOtpFallbackScreens.PasskeyAppend;
    }

    return PasskeyLoginWithEmailOtpFallbackScreens.End;
  },
  [PasskeyLoginWithEmailOtpFallbackScreens.PasskeyAppend]: (flowOptions, event) => {
    switch (event) {
      case FlowHandlerEvents.PasskeyError:
        if (flowOptions?.retryPasskeyOnError) {
          return PasskeyLoginWithEmailOtpFallbackScreens.PasskeyError;
        }

        return PasskeyLoginWithEmailOtpFallbackScreens.End;
      case FlowHandlerEvents.ShowBenefits:
        return PasskeyLoginWithEmailOtpFallbackScreens.PasskeyBenefits;
      default:
        return PasskeyLoginWithEmailOtpFallbackScreens.End;
    }
  },
  [PasskeyLoginWithEmailOtpFallbackScreens.PasskeyError]: (_, event, eventOptions) => {
    switch (event) {
      case FlowHandlerEvents.CancelPasskey:
      case FlowHandlerEvents.EmailOtp:
        if (eventOptions?.isUserAuthenticated) {
          return PasskeyLoginWithEmailOtpFallbackScreens.End;
        }

        return PasskeyLoginWithEmailOtpFallbackScreens.EnterOtp;
      default:
        return PasskeyLoginWithEmailOtpFallbackScreens.End;
    }
  },
  [PasskeyLoginWithEmailOtpFallbackScreens.PasskeyBenefits]: (flowOptions, event) => {
    switch (event) {
      case FlowHandlerEvents.PasskeyError:
        if (flowOptions?.retryPasskeyOnError) {
          return PasskeyLoginWithEmailOtpFallbackScreens.PasskeyError;
        }

        return PasskeyLoginWithEmailOtpFallbackScreens.End;
      default:
        return PasskeyLoginWithEmailOtpFallbackScreens.End;
    }
  },
};
