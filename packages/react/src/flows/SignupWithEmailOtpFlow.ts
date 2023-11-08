import { EmailOtpSignupScreens } from '@corbado/web-core'

import { EmailLink } from '../screens/EmailLink';
import { InitiateSignup } from '../screens/InitiateSignup';

export const SignupWithEmailOtpFlow = {
  [EmailOtpSignupScreens.Start]: InitiateSignup,
  [EmailOtpSignupScreens.EnterOtp]: EmailLink,
};
