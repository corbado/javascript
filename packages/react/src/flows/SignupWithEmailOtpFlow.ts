import { EmailOtpSignupScreens, type ScreenNames } from '@corbado/web-core'

import { EmailLink } from '../screens/EmailLink';
import { InitiateSignup } from '../screens/InitiateSignup';

interface SignupWithEmailOTPScreens {
    [x:ScreenNames]: React.ReactNode;
}

export const SignupWithEmailOtpFlow: SignupWithEmailOTPScreens = {
  [EmailOtpSignupScreens.Start]: InitiateSignup, 
  [EmailOtpSignupScreens.EnterOtp]: EmailLink,
};
