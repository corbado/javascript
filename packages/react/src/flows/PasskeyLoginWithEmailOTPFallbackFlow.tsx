import { ScreenNames } from '@corbado/shared-ui';

import { EmailOTP } from '../screens/authentication/EmailOTP';
import { PasskeyError } from '../screens/authentication/flows/passkeyLoginWithEmailOTPFallback/PasskeyError';
import { Start } from '../screens/authentication/flowtypes/login/Start';
import { PasskeyAppend } from '../screens/authentication/PasskeyAppend';
import { PasskeyBenefits } from '../screens/authentication/PasskeyBenefits';

export const PasskeyLoginWithEmailOTPFallbackFlow = {
  [ScreenNames.Start]: Start,
  [ScreenNames.EnterOTP]: EmailOTP,
  [ScreenNames.PasskeyAppend]: PasskeyAppend,
  [ScreenNames.PasskeyError]: PasskeyError,
  [ScreenNames.PasskeyBenefits]: PasskeyBenefits,
};
