import {EmailOTP} from "../screens/EmailOTP";
import {InitiateSignup} from "../screens/InitiateSignup";
import {EmailOtpSignupScreens} from "@corbado/web-core";

export const EmailOTPSignupFlow = {
    [EmailOtpSignupScreens.Start]: InitiateSignup,
    [EmailOtpSignupScreens.EnterOtp]: EmailOTP,
};
