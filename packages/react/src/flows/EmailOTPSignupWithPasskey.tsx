import { ScreenNames } from '@corbado/shared-ui';

import { EmailOTP } from '../screens/authentication/EmailOTP';
import { PasskeyError } from '../screens/authentication/flows/emailOtpSignupWithPasskey/PasskeyError';
import { Start } from '../screens/authentication/flowtypes/signup/Start';
import { PasskeyAppend } from '../screens/authentication/PasskeyAppend';
import { PasskeyBenefits } from '../screens/authentication/PasskeyBenefits';
import { PasskeySuccess } from '../screens/authentication/PasskeySuccess';

export const EmailOTPSignupWithPasskeyFlow = {
  [ScreenNames.Start]: Start,
  [ScreenNames.EnterOTP]: EmailOTP,
  [ScreenNames.PasskeyAppend]: PasskeyAppend,
  [ScreenNames.PasskeyBenefits]: PasskeyBenefits,
  [ScreenNames.PasskeySuccess]: PasskeySuccess,
  [ScreenNames.PasskeyError]: PasskeyError,
};
