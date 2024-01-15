import { ScreenNames } from '@corbado/shared-ui';

import { EmailOTP } from '../screens/authentication/common/EmailOTP';
import { PasskeyError } from '../screens/authentication/login/flows/passkeyLoginWithEmailOTPFallback/PasskeyError';
import { Start } from '../screens/authentication/login/Start';
import { PasskeyAppend } from '../screens/authentication/common/PasskeyAppend';
import { PasskeyBenefits } from '../screens/authentication/common/PasskeyBenefits';

export const PasskeyLoginWithEmailOTPFallbackFlow = {
  [ScreenNames.Start]: Start,
  [ScreenNames.EnterOTP]: EmailOTP,
  [ScreenNames.PasskeyAppend]: PasskeyAppend,
  [ScreenNames.PasskeyError]: PasskeyError,
  [ScreenNames.PasskeyBenefits]: PasskeyBenefits,
};
