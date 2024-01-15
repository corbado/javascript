import { ScreenNames } from '@corbado/shared-ui';

import { EmailOTP } from '../screens/authentication/common/EmailOTP';
import { PasskeyAppend } from '../screens/authentication/common/PasskeyAppend';
import { PasskeyBenefits } from '../screens/authentication/common/PasskeyBenefits';
import { PasskeyError } from '../screens/authentication/login/flows/passkeyLoginWithEmailOTPFallback/PasskeyError';
import { Start } from '../screens/authentication/login/Start';

export const PasskeyLoginWithEmailOTPFallbackFlow = {
  [ScreenNames.Start]: Start,
  [ScreenNames.EnterOTP]: EmailOTP,
  [ScreenNames.PasskeyAppend]: PasskeyAppend,
  [ScreenNames.PasskeyError]: PasskeyError,
  [ScreenNames.PasskeyBenefits]: PasskeyBenefits,
};
