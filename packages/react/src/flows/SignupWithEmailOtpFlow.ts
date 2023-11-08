import { EmailOtpSignupScreens, type ScreenNames } from '@corbado/web-core'

import { EmailLink } from '../screens/EmailLink';
import { InitiateSignup } from '../screens/InitiateSignup';

export type SignupWithEmailOTPScreens = {
  [key in ScreenNames]?: () => React.ReactNode;
}

export const SignupWithEmailOtpFlow: SignupWithEmailOTPScreens = {
  [EmailOtpSignupScreens.Start]: InitiateSignup, 
  [EmailOtpSignupScreens.EnterOtp]: EmailLink,
};
