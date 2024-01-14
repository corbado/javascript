import { ScreenNames } from '@corbado/shared-ui';

import { EmailOTP } from '../screens/auth/EmailOTP';
import { PasskeyError } from '../screens/auth/flows/passkeyLoginWithEmailOTPFallback/PasskeyError';
import { Start } from '../screens/auth/flowtypes/login/Start';
import { PasskeyAppend } from '../screens/auth/PasskeyAppend';
import { PasskeyBenefits } from '../screens/auth/PasskeyBenefits';

export const PasskeyLoginWithEmailOTPFallbackFlow = {
  [ScreenNames.Start]: Start,
  [ScreenNames.EnterOTP]: EmailOTP,
  [ScreenNames.PasskeyAppend]: PasskeyAppend,
  [ScreenNames.PasskeyError]: PasskeyError,
  [ScreenNames.PasskeyBenefits]: PasskeyBenefits,
};
