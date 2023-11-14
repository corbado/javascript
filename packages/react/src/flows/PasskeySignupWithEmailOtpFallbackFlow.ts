
import { PasskeySignupWithEmailOtpFallbackScreens } from '@corbado/react-sdk';

import { CreatePasskeyBenefit } from '../screens/CreatePasskeyBenefit';
import { EmailLink } from '../screens/EmailLink';
import { InitiateSignup } from '../screens/InitiateSignup';
import { PasskeyCreationError } from '../screens/PasskeyCreationError';
import { PasskeyCreationSuccess } from '../screens/PasskeyCreationSuccess';
import { PasskeyLoginActivation } from '../screens/PasskeyLoginActivation';
import { PasskeySignup } from '../screens/PasskeySignup';
import type { ScreensList } from '../types';

export const PasskeySignupWithEmailOtpFallbackFlow: ScreensList = {
  [PasskeySignupWithEmailOtpFallbackScreens.Start]: InitiateSignup, 
  [PasskeySignupWithEmailOtpFallbackScreens.CreatePasskey]: PasskeySignup, 
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyBenefits]: CreatePasskeyBenefit, 
  [PasskeySignupWithEmailOtpFallbackScreens.EnterOtp]: EmailLink,
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome]: PasskeyCreationSuccess,
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyError]: PasskeyCreationError,
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyAppend]: PasskeyLoginActivation,
};
