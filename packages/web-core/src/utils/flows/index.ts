import { type Flows, LoginFlowNames, SignUpFlowNames } from "../../types";
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
