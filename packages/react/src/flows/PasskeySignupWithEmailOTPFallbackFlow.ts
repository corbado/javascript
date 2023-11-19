import {InitiateSignup} from "../screens/InitiateSignup";
import {PasskeySignupWithEmailOtpFallbackScreens} from "@corbado/web-core";
import {CreatePasskey} from "../screens/CreatePasskey";
import {PasskeyCreationSuccess} from "../screens/PasskeyCreationSuccess";
import {PasskeyCreationError} from "../screens/PasskeyCreationError";
import {PasskeySignup} from "../screens/PasskeySignup";
import {EmailOTP} from "../screens/EmailOTP";

export const PasskeySignupWithEmailOTPFallbackFlow = {
  [PasskeySignupWithEmailOtpFallbackScreens.Start]: InitiateSignup,
  [PasskeySignupWithEmailOtpFallbackScreens.CreatePasskey]: PasskeySignup,
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyBenefits]: CreatePasskey,
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome]: PasskeyCreationSuccess,
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyError]: PasskeyCreationError,
  [PasskeySignupWithEmailOtpFallbackScreens.EnterOtp]: EmailOTP,
};
