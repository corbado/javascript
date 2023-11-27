import { PasskeyLoginWithEmailOtpFallbackScreens } from '@corbado/web-core';

import { EmailOTP } from '../screens/login/EmailOTP';
import { InitiateLogin } from '../screens/login/InitiateLogin';
import { PasskeyError } from '../screens/login/PasskeyError';
import { PasskeyAppend } from '../screens/shared/PasskeyAppend';

export const PasskeyLoginWithEmailOTPFallbackFlow = {
  [PasskeyLoginWithEmailOtpFallbackScreens.Start]: InitiateLogin,
  [PasskeyLoginWithEmailOtpFallbackScreens.EnterOtp]: EmailOTP,
  [PasskeyLoginWithEmailOtpFallbackScreens.PasskeyAppend]: PasskeyAppend,
  [PasskeyLoginWithEmailOtpFallbackScreens.PasskeyError]: PasskeyError,
};
