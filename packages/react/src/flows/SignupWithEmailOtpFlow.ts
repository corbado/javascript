import { EmailOtpSignupScreens } from "@corbado/react-sdk";

import { CreatePasskeyBenefit } from "../screens/CreatePasskeyBenefit";
import { EmailLink } from "../screens/EmailLink";
import { InitiateSignup } from "../screens/InitiateSignup";
import { PasskeyCreationError } from "../screens/PasskeyCreationError";
import { PasskeyCreationSuccess } from "../screens/PasskeyCreationSuccess";
import { PasskeyLoginActivation } from "../screens/PasskeyLoginActivation";
import type { ScreensList } from "../types";

export const SignupWithEmailOtpFlow: ScreensList = {
  [EmailOtpSignupScreens.Start]: InitiateSignup,
  [EmailOtpSignupScreens.EnterOtp]: EmailLink,
  [EmailOtpSignupScreens.PasskeyBenefits]: CreatePasskeyBenefit, 
  [EmailOtpSignupScreens.PasskeyOption]: PasskeyLoginActivation,
  [EmailOtpSignupScreens.PasskeyWelcome]: PasskeyCreationSuccess,
  [EmailOtpSignupScreens.PasskeyError]: PasskeyCreationError,
};
