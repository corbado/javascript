import { PasskeyLoginWithEmailOtpFallbackScreens } from '@corbado/web-core';

import { EmailOTP } from '../screens/EmailOTP';
import { InitiateLogin } from '../screens/InitiateLogin';
import { PasskeyError } from '../screens/PasskeyError';
import { PasskeyWelcome } from '../screens/PasskeyWelcome';

export const PasskeySignupWithEmailOTPFallbackFlow = {
  [PasskeyLoginWithEmailOtpFallbackScreens.Start]: InitiateLogin,
  [PasskeyLoginWithEmailOtpFallbackScreens.EnterOtp]: EmailOTP,
  [PasskeyLoginWithEmailOtpFallbackScreens.PasskeyAppend]: PasskeyWelcome,
  [PasskeyLoginWithEmailOtpFallbackScreens.PasskeyError]: PasskeyError,
};
