import {EmailOTP} from "../screens/EmailOTP";
import {InitiateSignup} from "../screens/InitiateSignup";
import {EmailOtpSignupScreens, PasskeySignupWithEmailOtpFallbackScreens} from "@corbado/web-core";
import {PasskeySignup} from "../screens/PasskeySignup";
import {CreatePasskey} from "../screens/CreatePasskey";
import {PasskeyCreationSuccess} from "../screens/PasskeyCreationSuccess";
import {PasskeyCreationError} from "../screens/PasskeyCreationError";
import {PasskeyLoginWithEmailOtpFallbackScreens} from "@corbado/react-sdk";
import {InitiateLogin} from "../screens/InitiateLogin";

export const EmailOTPSignupFlow = {
    [EmailOtpSignupScreens.Start]: InitiateSignup,
    [EmailOtpSignupScreens.EnterOtp]: EmailOTP,
};

export const PasskeySignupWithEmailOTPFallbackFlow = {
  [PasskeySignupWithEmailOtpFallbackScreens.Start]: InitiateSignup,
  [PasskeySignupWithEmailOtpFallbackScreens.CreatePasskey]: PasskeySignup,
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyBenefits]: CreatePasskey,
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome]: PasskeyCreationSuccess,
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyError]: PasskeyCreationError,
  [PasskeySignupWithEmailOtpFallbackScreens.EnterOtp]: EmailOTP,
};

export const PasskeyLoginWithEmailOTPFallbackFlow = {
  [PasskeyLoginWithEmailOtpFallbackScreens.Start]: InitiateLogin
}
