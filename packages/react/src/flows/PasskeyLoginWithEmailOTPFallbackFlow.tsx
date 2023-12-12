import { PasskeyLoginWithEmailOtpFallbackScreens } from '@corbado/shared-ui';

import { EmailOTP } from '../screens/login/EmailOTP';
import { InitiateLogin } from '../screens/login/InitiateLogin';
import { PasskeyAppend } from '../screens/login/PasskeyAppend';
import { PasskeyError } from '../screens/login/PasskeyError';
import { PasskeyBenefits } from '../screens/signup/PasskeyBenefits';

export const PasskeyLoginWithEmailOTPFallbackFlow = {
  [PasskeyLoginWithEmailOtpFallbackScreens.Start]: InitiateLogin,
  [PasskeyLoginWithEmailOtpFallbackScreens.EnterOtp]: EmailOTP,
  [PasskeyLoginWithEmailOtpFallbackScreens.PasskeyAppend]: PasskeyAppend,
  [PasskeyLoginWithEmailOtpFallbackScreens.PasskeyError]: PasskeyError,
  [PasskeyLoginWithEmailOtpFallbackScreens.PasskeyBenefits]: PasskeyBenefits,
};
