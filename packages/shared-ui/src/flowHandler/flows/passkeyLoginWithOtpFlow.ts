import { PasskeyLoginWithEmailOtpFallbackScreens } from '../constants';
import { FlowUpdate } from '../stepFunctionResult';
import type { Flow } from '../types';

export const PasskeyLoginWithEmailOTPFallbackFlow: Flow = {
  [PasskeyLoginWithEmailOtpFallbackScreens.Start]: {
    onEvent: async () => {
      return FlowUpdate.state({});
      /*
            if (error) {
              if (state.flowOptions?.retryPasskeyOnError) {
                return PasskeyLoginWithEmailOtpFallbackScreens.PasskeyError;
              }

              return PasskeyLoginWithEmailOtpFallbackScreens.EnterOtp;
            }

            switch (event) {
              case FlowHandlerEvents.EmailOtp:
                return PasskeyLoginWithEmailOtpFallbackScreens.EnterOtp;
              default:
                return PasskeyLoginWithEmailOtpFallbackScreens.End;
            }*/
    },
  },
  [PasskeyLoginWithEmailOtpFallbackScreens.EnterOtp]: {
    onEvent: async () => {
      return FlowUpdate.state({});
      /*
      if (event === FlowHandlerEvents.CancelOtp) {
        return PasskeyLoginWithEmailOtpFallbackScreens.Start;
      }

      const isPasskeySupported = await canUsePasskeys();

      if (flowOptions?.passkeyAppend && isPasskeySupported && !eventOptions?.userHasPasskey) {
        return PasskeyLoginWithEmailOtpFallbackScreens.PasskeyAppend;
      }

      return PasskeyLoginWithEmailOtpFallbackScreens.End;*/
    },
  },
  [PasskeyLoginWithEmailOtpFallbackScreens.PasskeyAppend]: {
    onEvent: async () => {
      return FlowUpdate.state({});
      /*switch (event) {
        case FlowHandlerEvents.PasskeyError:
          if (flowOptions?.retryPasskeyOnError) {
            return PasskeyLoginWithEmailOtpFallbackScreens.PasskeyError;
          }

          return PasskeyLoginWithEmailOtpFallbackScreens.End;
        case FlowHandlerEvents.ShowBenefits:
          return PasskeyLoginWithEmailOtpFallbackScreens.PasskeyBenefits;
        default:
          return PasskeyLoginWithEmailOtpFallbackScreens.End;
      }*/
    },
  },
  [PasskeyLoginWithEmailOtpFallbackScreens.PasskeyError]: {
    onEvent: async () => {
      return FlowUpdate.state({});
      /*
      switch (event) {
        case FlowHandlerEvents.CancelPasskey:
        case FlowHandlerEvents.EmailOtp:
          if (eventOptions?.isUserAuthenticated) {
            return PasskeyLoginWithEmailOtpFallbackScreens.End;
          }

          return PasskeyLoginWithEmailOtpFallbackScreens.EnterOtp;
        default:
          return PasskeyLoginWithEmailOtpFallbackScreens.End;
      }*/
    },
  },
  [PasskeyLoginWithEmailOtpFallbackScreens.PasskeyBenefits]: {
    onEvent: async () => {
      return FlowUpdate.state({});
      /*
      switch (event) {
        case FlowHandlerEvents.PasskeyError:
          if (flowOptions?.retryPasskeyOnError) {
            return PasskeyLoginWithEmailOtpFallbackScreens.PasskeyError;
          }

          return PasskeyLoginWithEmailOtpFallbackScreens.End;
        default:
          return PasskeyLoginWithEmailOtpFallbackScreens.End;
      }*/
    },
  },
};
