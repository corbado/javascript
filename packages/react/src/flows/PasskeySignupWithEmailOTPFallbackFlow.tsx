import { PasskeySignupWithEmailOtpFallbackScreens } from '@corbado/web-core';

import { EmailOTP } from '../screens/EmailOTP';
import { InitiateSignup } from '../screens/InitiateSignup';
import { PasskeyAppend } from '../screens/PasskeyAppend';
import { PasskeyBenefits } from '../screens/PasskeyBenefits';
import { PasskeyError } from '../screens/PasskeyError';
import { PasskeySignup } from '../screens/PasskeySignup';
import { PasskeyWelcome } from '../screens/PasskeyWelcome';

export const PasskeySignupWithEmailOTPFallbackFlow = {
  [PasskeySignupWithEmailOtpFallbackScreens.Start]: InitiateSignup,
  [PasskeySignupWithEmailOtpFallbackScreens.CreatePasskey]: PasskeySignup,
  [PasskeySignupWithEmailOtpFallbackScreens.EnterOtp]: EmailOTP,
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyAppend]: PasskeyAppend,
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyBenefits]: PasskeyBenefits,
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome]: PasskeyWelcome,
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyError]: PasskeyError,
};
