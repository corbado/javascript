import type { Flow } from '../../types';
import { EmailOtpSignupScreens } from '../constants';
import { canUsePasskeys } from '../helpers';

// TODO: Update step functions
export const EmailOTPSignupFlow: Flow = {
  [EmailOtpSignupScreens.Start]: () => EmailOtpSignupScreens.EnterOtp,
  [EmailOtpSignupScreens.EnterOtp]: async flowOptions => {
    if (flowOptions.passkeyAppend) {
      const isPasskeySupported = await canUsePasskeys();
      return isPasskeySupported ? EmailOtpSignupScreens.PasskeyOption : EmailOtpSignupScreens.End;
    }
    return EmailOtpSignupScreens.End;
  },
  [EmailOtpSignupScreens.PasskeyOption]: (_, __?: string) => {
    return EmailOtpSignupScreens.End;
  },
  [EmailOtpSignupScreens.PasskeyBenefits]: (_, __, ___?: string) => {
    return EmailOtpSignupScreens.End;
  },
  [EmailOtpSignupScreens.PasskeyWelcome]: () => EmailOtpSignupScreens.End,
  [EmailOtpSignupScreens.PasskeyError]: (_, __?: string) => {
    return EmailOtpSignupScreens.End;
  },
};
