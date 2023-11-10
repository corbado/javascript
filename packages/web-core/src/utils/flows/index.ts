import type { Flows } from "../../types";
import { LoginFlowNames, SignUpFlowNames } from "../constants/flowHandler";
import { EmailOTPSignupFlow } from "./emailOtpSignupFlow";
import { PasskeyLoginWithEmailOTPFallbackFlow } from "./passkeyLoginFlow";
import { PasskeySignupWithEmailOTPFallbackFlow } from "./passkeySignupFlow";

export const flows: Flows = {
  [SignUpFlowNames.PasskeySignupWithEmailOTPFallback]:
    PasskeySignupWithEmailOTPFallbackFlow,
  [SignUpFlowNames.EmailOTPSignup]: EmailOTPSignupFlow,
  [LoginFlowNames.PasskeyLoginWithEmailOTPFallback]:
    PasskeyLoginWithEmailOTPFallbackFlow,
};
export * from "./emailOtpSignupFlow";
export * from "./passkeySignupFlow";
export * from "./passkeyLoginFlow";
