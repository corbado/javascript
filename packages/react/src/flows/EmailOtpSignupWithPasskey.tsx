import { EmailOtpSignupWithPasskeyScreens } from '@corbado/shared-ui';

import { EmailOTP } from '../screens/signup/EmailOTP';
import { PasskeyError } from '../screens/signup/emailOtpSignupWithPasskey/PasskeyError';
import { PasskeyAppend } from '../screens/signup/PasskeyAppend';
import { PasskeyBenefits } from '../screens/signup/PasskeyBenefits';
import { PasskeySuccess } from '../screens/signup/PasskeySuccess';
import { Start } from '../screens/signup/Start';

export const EmailOtpSignupWithPasskeyFlow = {
  [EmailOtpSignupWithPasskeyScreens.Start]: Start,
  [EmailOtpSignupWithPasskeyScreens.EnterOtp]: EmailOTP,
  [EmailOtpSignupWithPasskeyScreens.PasskeyAppend]: PasskeyAppend,
  [EmailOtpSignupWithPasskeyScreens.PasskeyBenefits]: PasskeyBenefits,
  [EmailOtpSignupWithPasskeyScreens.PasskeySuccess]: PasskeySuccess,
  [EmailOtpSignupWithPasskeyScreens.PasskeyError]: PasskeyError,
};
