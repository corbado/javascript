import { PasskeySignupWithEmailOtpFallbackScreens } from '@corbado/web-core';

import { PasskeyAppend } from '../screens/shared/PasskeyAppend';
import { EmailOTP } from '../screens/signup/EmailOTP';
import { InitiateSignup } from '../screens/signup/InitiateSignup';
import { PasskeyBenefits } from '../screens/signup/PasskeyBenefits';
import { PasskeyError } from '../screens/signup/PasskeyError';
import { PasskeySignup } from '../screens/signup/PasskeySignup';
import { PasskeyWelcome } from '../screens/signup/PasskeyWelcome';

export const PasskeySignupWithEmailOTPFallbackFlow = {
  [PasskeySignupWithEmailOtpFallbackScreens.Start]: InitiateSignup,
  [PasskeySignupWithEmailOtpFallbackScreens.CreatePasskey]: PasskeySignup,
  [PasskeySignupWithEmailOtpFallbackScreens.EnterOtp]: EmailOTP,
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyAppend]: PasskeyAppend,
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyBenefits]: PasskeyBenefits,
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome]: PasskeyWelcome,
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyError]: PasskeyError,
};
