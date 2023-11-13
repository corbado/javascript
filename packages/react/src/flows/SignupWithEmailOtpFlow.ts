import { EmailOtpSignupScreens } from "@corbado/react-sdk";

import { EmailLink } from "../screens/EmailLink";
import { InitiateSignup } from "../screens/InitiateSignup";
import type { SignupWithEmailOTPScreens } from "../types";

export const SignupWithEmailOtpFlow: SignupWithEmailOTPScreens = {
  [EmailOtpSignupScreens.Start]: InitiateSignup,
  [EmailOtpSignupScreens.EnterOtp]: EmailLink,
};
