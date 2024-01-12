import { PasskeyLoginWithEmailOtpFallbackScreens } from '@corbado/shared-ui';

import { EmailOTP } from '../screens/login/EmailOTP';
import { PasskeyAppend } from '../screens/login/PasskeyAppend';
import { PasskeyBenefits } from '../screens/login/PasskeyBenefits';
import { PasskeyError } from '../screens/login/PasskeyError';
import { Start } from '../screens/login/Start';

export const PasskeyLoginWithEmailOTPFallbackFlow = {
  [PasskeyLoginWithEmailOtpFallbackScreens.Start]: Start,
  [PasskeyLoginWithEmailOtpFallbackScreens.EnterOtp]: EmailOTP,
  [PasskeyLoginWithEmailOtpFallbackScreens.PasskeyAppend]: PasskeyAppend,
  [PasskeyLoginWithEmailOtpFallbackScreens.PasskeyError]: PasskeyError,
  [PasskeyLoginWithEmailOtpFallbackScreens.PasskeyBenefits]: PasskeyBenefits,
};
