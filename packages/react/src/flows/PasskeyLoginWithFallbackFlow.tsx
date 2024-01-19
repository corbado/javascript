import { ScreenNames } from '@corbado/shared-ui';

import { EmailLinkSent } from '../screens/base/authentication/common/EmailLinkSent';
import { EmailLinkVerification } from '../screens/base/authentication/common/EmailLinkVerification';
import { EmailOTP } from '../screens/base/authentication/common/EmailOTP';
import { PasskeyAppend } from '../screens/base/authentication/common/PasskeyAppend';
import { PasskeyBenefits } from '../screens/base/authentication/common/PasskeyBenefits';
import { PasskeyError } from '../screens/base/authentication/login/flows/passkeyLoginWithEmailOTPFallback/PasskeyError';
import { Start } from '../screens/base/authentication/login/Start';

export const PasskeyLoginWithFallbackFlow = {
  [ScreenNames.Start]: Start,
  [ScreenNames.EmailOTPVerification]: EmailOTP,
  [ScreenNames.EmailLinkSent]: EmailLinkSent,
  [ScreenNames.EmailLinkVerification]: EmailLinkVerification,
  [ScreenNames.PasskeyAppend]: PasskeyAppend,
  [ScreenNames.PasskeyError]: PasskeyError,
  [ScreenNames.PasskeyBenefits]: PasskeyBenefits,
};
