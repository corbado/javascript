import { ScreenNames } from '@corbado/shared-ui';

import { EmailOTP } from '../screens/auth/EmailOTP';
import { PasskeyError } from '../screens/auth/flows/passkeySignupWithEmailOtpFallback/PasskeyError';
import { PasskeyCreate } from '../screens/auth/flowtypes/signup/PasskeyCreate';
import { Start } from '../screens/auth/flowtypes/signup/Start';
import { PasskeyAppend } from '../screens/auth/PasskeyAppend';
import { PasskeyBenefits } from '../screens/auth/PasskeyBenefits';
import { PasskeySuccess } from '../screens/auth/PasskeySuccess';

export const PasskeySignupWithEmailOTPFallbackFlow = {
  [ScreenNames.Start]: Start,
  [ScreenNames.PasskeyCreate]: PasskeyCreate,
  [ScreenNames.EnterOTP]: EmailOTP,
  [ScreenNames.PasskeyAppend]: PasskeyAppend,
  [ScreenNames.PasskeyBenefits]: PasskeyBenefits,
  [ScreenNames.PasskeySuccess]: PasskeySuccess,
  [ScreenNames.PasskeyError]: PasskeyError,
};
