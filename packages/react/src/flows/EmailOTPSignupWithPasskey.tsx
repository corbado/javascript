import { ScreenNames } from '@corbado/shared-ui';

import { EmailOTP } from '../screens/authentication/common/EmailOTP';
import { PasskeyError } from '../screens/authentication/signup/flows/emailOtpSignupWithPasskey/PasskeyError';
import { Start } from '../screens/authentication/signup/Start';
import { PasskeyAppend } from '../screens/authentication/common/PasskeyAppend';
import { PasskeyBenefits } from '../screens/authentication/common/PasskeyBenefits';
import { PasskeySuccess } from '../screens/authentication/common/PasskeySuccess';

export const EmailOTPSignupWithPasskeyFlow = {
  [ScreenNames.Start]: Start,
  [ScreenNames.EnterOTP]: EmailOTP,
  [ScreenNames.PasskeyAppend]: PasskeyAppend,
  [ScreenNames.PasskeyBenefits]: PasskeyBenefits,
  [ScreenNames.PasskeySuccess]: PasskeySuccess,
  [ScreenNames.PasskeyError]: PasskeyError,
};
