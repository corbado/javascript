import { PasskeySignupWithEmailOtpFallbackScreens } from '@corbado/web-core'

import { EmailLink } from '../screens/EmailLink';
import { InitiateSignup } from '../screens/InitiateSignup';
import { PasskeyCreationError } from '../screens/PasskeyCreationError';
import { PasskeyCreationSuccess } from '../screens/PasskeyCreationSuccess';

import type { ScreensList } from '../types';
import { PasskeySignup } from '../screens/PasskeySignup';

export const PasskeySignupWithEmailOtpFallbackFlow: ScreensList = {
  [PasskeySignupWithEmailOtpFallbackScreens.Start]: InitiateSignup, 
  [PasskeySignupWithEmailOtpFallbackScreens.CreatePasskey]: PasskeySignup, 
  [PasskeySignupWithEmailOtpFallbackScreens.EnterOtp]: EmailLink,
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome]: PasskeyCreationSuccess,
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyError]: PasskeyCreationError,
};
