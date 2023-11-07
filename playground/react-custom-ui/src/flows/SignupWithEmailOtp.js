import { InitiateSignUp } from "../components/InitiateSignup";
import { VerifyOtp } from "../components/VerifyOtp";

export const SignupWithEmailOtpFlows = {
  start: <InitiateSignUp />,
  "enter-otp": <VerifyOtp />,
};
