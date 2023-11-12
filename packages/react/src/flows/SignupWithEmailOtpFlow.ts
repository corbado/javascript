import { EmailOtpSignupScreens } from '@corbado/web-core'

import { EmailLink } from '../screens/EmailLink';
import { InitiateSignup } from '../screens/InitiateSignup';
import type { ScreensList } from '../types';

export const SignupWithEmailOtpFlow: ScreensList = {
  [EmailOtpSignupScreens.Start]: InitiateSignup, 
  [EmailOtpSignupScreens.EnterOtp]: EmailLink,
};
