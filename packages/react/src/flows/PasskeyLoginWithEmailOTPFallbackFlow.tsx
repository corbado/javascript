import { PasskeyLoginWithEmailOtpFallbackScreens } from '@corbado/web-core';

import { EmailOTP } from '../screens/EmailOTP';
import { InitiateLogin } from '../screens/InitiateLogin';
import { PasskeyAppend } from '../screens/PasskeyAppend';
import { PasskeyError } from '../screens/PasskeyError';

export const PasskeyLoginWithEmailOTPFallbackFlow = {
  [PasskeyLoginWithEmailOtpFallbackScreens.Start]: InitiateLogin,
  [PasskeyLoginWithEmailOtpFallbackScreens.EnterOtp]: EmailOTP,
  [PasskeyLoginWithEmailOtpFallbackScreens.PasskeyAppend]: PasskeyAppend,
  [PasskeyLoginWithEmailOtpFallbackScreens.PasskeyError]: PasskeyError,
};
