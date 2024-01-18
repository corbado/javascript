import { ScreenNames } from '@corbado/shared-ui';

import { EmailLinkSent } from '../screens/base/authentication/common/EmailLinkSent';
import { EmailLinkVerification } from '../screens/base/authentication/common/EmailLinkVerification';
import { EmailOTP } from '../screens/base/authentication/common/EmailOTP';
import { PasskeyAppend } from '../screens/base/authentication/common/PasskeyAppend';
import { PasskeyBenefits } from '../screens/base/authentication/common/PasskeyBenefits';
import { PasskeyError } from '../screens/base/authentication/signup/flows/passkeySignupWithEmailOtpFallback/PasskeyError';
import { PasskeyCreate } from '../screens/base/authentication/signup/PasskeyCreate';
import { PasskeySuccess } from '../screens/base/authentication/signup/PasskeySuccess';
import { Start } from '../screens/base/authentication/signup/Start';

export const PasskeySignupWithEmailOTPFallbackFlow = {
  [ScreenNames.Start]: Start,
  [ScreenNames.PasskeyCreate]: PasskeyCreate,
  [ScreenNames.EnterOTP]: EmailOTP,
  [ScreenNames.EmailLinkSent]: EmailLinkSent,
  [ScreenNames.EmailLinkVerification]: EmailLinkVerification,
  [ScreenNames.PasskeyAppend]: PasskeyAppend,
  [ScreenNames.PasskeyBenefits]: PasskeyBenefits,
  [ScreenNames.PasskeySuccess]: PasskeySuccess,
  [ScreenNames.PasskeyError]: PasskeyError,
};
