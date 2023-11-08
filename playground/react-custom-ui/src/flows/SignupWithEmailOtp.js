import { InitiateSignUp } from "../components/InitiateSignup";
import { PasskeyBenefits } from "../components/PassketBenefits";
import { PasskeyError } from "../components/PassketError";
import { PasskeyOption } from "../components/PassketOptions";
import { PasskeyWelcome } from "../components/PassketWelcome";
import { VerifyOtp } from "../components/VerifyOtp";

export const SignupWithEmailOtpFlows = {
  start: <InitiateSignUp />,
  "enter-otp": <VerifyOtp />,
  "passkey-option": <PasskeyOption />,
  "passkey-benefits": <PasskeyBenefits />,
  "passkey-welcome": <PasskeyWelcome />,
  "passkey-error": <PasskeyError />,
  end: <div>End of Journey</div>,
};
