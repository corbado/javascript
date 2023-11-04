import type { Flows } from "../../types";
import { EmailOTPSignupFlow } from "./EmailOTPSignup";
import { PasskeyLoginWithEmailOTPFallbackFlow } from "./PasskeyLoginWithEmailOTPFallback";
import { PasskeySignupWithEmailOTPFallbackFlow } from "./PasskeySignupWithEmailOTPFallback";

export const flows: Flows = {
  PasskeySignupWithEmailOTPFallback: PasskeySignupWithEmailOTPFallbackFlow,
  EmailOTPSignup: EmailOTPSignupFlow,
  PasskeyLoginWithEmailOTPFallback: PasskeyLoginWithEmailOTPFallbackFlow,
};
