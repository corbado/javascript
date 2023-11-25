import type { Flow } from '../../types';
import { EmailOtpSignupScreens } from '../constants';
import { canUsePasskeys } from '../helpers';

// TODO: Update step functions
export const EmailOTPSignupFlow: Flow = {
  [EmailOtpSignupScreens.Start]: () => EmailOtpSignupScreens.EnterOtp,
  [EmailOtpSignupScreens.EnterOtp]: async flowOptions => {
    if (flowOptions?.passkeyAppend) {
      const isPasskeySupported = await canUsePasskeys();
      return isPasskeySupported ? EmailOtpSignupScreens.PasskeyOption : EmailOtpSignupScreens.End;
    }
    return EmailOtpSignupScreens.End;
  },
  [EmailOtpSignupScreens.PasskeyOption]: () => {
    return EmailOtpSignupScreens.End;
  },
  [EmailOtpSignupScreens.PasskeyBenefits]: () => {
    return EmailOtpSignupScreens.End;
  },
  [EmailOtpSignupScreens.PasskeyWelcome]: () => EmailOtpSignupScreens.End,
  [EmailOtpSignupScreens.PasskeyError]: () => {
    return EmailOtpSignupScreens.End;
  },
};
