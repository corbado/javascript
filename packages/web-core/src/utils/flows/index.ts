import type { Flows } from "../../types";
import { EmailOTPSignupFlow } from "./emailOtpSignupFlow";
import { PasskeyLoginWithEmailOTPFallbackFlow } from "./passkeyLoginFlow";
import { PasskeySignupWithEmailOTPFallbackFlow } from "./passkeySignupFlow";

export const flows: Flows = {
  PasskeySignupWithEmailOTPFallback: PasskeySignupWithEmailOTPFallbackFlow,
  EmailOTPSignup: EmailOTPSignupFlow,
  PasskeyLoginWithEmailOTPFallback: PasskeyLoginWithEmailOTPFallbackFlow,
};
