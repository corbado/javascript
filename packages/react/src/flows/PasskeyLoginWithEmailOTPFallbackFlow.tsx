import { ScreenNames } from '@corbado/shared-ui';

import { EmailOTP } from '../screens/base/authentication/common/EmailOTP';
import { PasskeyAppend } from '../screens/base/authentication/common/PasskeyAppend';
import { PasskeyBenefits } from '../screens/base/authentication/common/PasskeyBenefits';
import { PasskeyError } from '../screens/base/authentication/login/flows/passkeyLoginWithEmailOTPFallback/PasskeyError';
import { Start } from '../screens/base/authentication/login/Start';

export const PasskeyLoginWithEmailOTPFallbackFlow = {
  [ScreenNames.Start]: Start,
  [ScreenNames.EnterOTP]: EmailOTP,
  [ScreenNames.PasskeyAppend]: PasskeyAppend,
  [ScreenNames.PasskeyError]: PasskeyError,
  [ScreenNames.PasskeyBenefits]: PasskeyBenefits,
};
