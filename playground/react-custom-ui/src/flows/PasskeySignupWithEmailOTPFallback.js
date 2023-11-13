import { CreatePasskey } from "../components/CreatePasskey";
import { InitiateSignUp } from "../components/InitiateSignup";
import { PasskeyBenefits } from "../components/PasskeyBenefits";
import { PasskeyError } from "../components/PasskeyError";
import { PasskeyOption } from "../components/PasskeyOptions";
import { PasskeyWelcome } from "../components/PasskeyWelcome";
import { VerifyOtp } from "../components/VerifyOtp";

export const PasskeySignupWithEmailOtpFallback = {
  start: <InitiateSignUp />,
  "create-passkey": <CreatePasskey />,
  "enter-otp": <VerifyOtp />,
  "passkey-append": <PasskeyOption />,
  "passkey-benefits": <PasskeyBenefits />,
  "passkey-welcome": <PasskeyWelcome />,
  "passkey-error": <PasskeyError />,
  end: <div>End of Journey</div>,
};
