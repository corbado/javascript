import { PasskeySignupWithEmailOtpFallbackScreens } from '@corbado/shared-ui';

import { EmailOTP } from '../screens/signup/EmailOTP';
import { PasskeyAppend } from '../screens/signup/PasskeyAppend';
import { PasskeyBenefits } from '../screens/signup/PasskeyBenefits';
import { PasskeyCreate } from '../screens/signup/PasskeyCreate';
import { PasskeyError } from '../screens/signup/passkeySignupWithEmailOtpFallback/PasskeyError';
import { PasskeySuccess } from '../screens/signup/PasskeySuccess';
import { Start } from '../screens/signup/Start';

export const PasskeySignupWithEmailOTPFallbackFlow = {
  [PasskeySignupWithEmailOtpFallbackScreens.Start]: Start,
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyCreate]: PasskeyCreate,
  [PasskeySignupWithEmailOtpFallbackScreens.EnterOtp]: EmailOTP,
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyAppend]: PasskeyAppend,
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyBenefits]: PasskeyBenefits,
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeySuccess]: PasskeySuccess,
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyError]: PasskeyError,
};
