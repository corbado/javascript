import {InitiateLogin} from "../components/InitiateLogin";
import {PasskeyError} from "../components/PasskeyError";
import {PasskeyOption} from "../components/PasskeyOptions";
import {VerifyOtp} from "../components/VerifyOtp";

export const PasskeyLoginWithEmailOtpFallback = {
  start: <InitiateLogin/>,
  "enter-otp": <VerifyOtp/>,
  "passkey-append": <PasskeyOption/>,
  "passkey-error": <PasskeyError/>,
  end: <div>End of Journey</div>,
};
