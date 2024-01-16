import { LoginFlowNames, SignUpFlowNames } from '../constants';
import type { Flows } from '../types';
import { PasskeyLoginWithEmailOTPFallbackFlow } from './login/passkeyLoginWithOtpFlow';
import { PasskeySignupWithFallbackFlow } from './signup/passkeySignupWithFallbackFlow';
import { VerificationMethodSignupWithPasskeyFlow } from './signup/verificationMethodSignupWithPasskey';

export const flows: Flows = {
  [SignUpFlowNames.PasskeySignupWithEmailOTPFallback]: PasskeySignupWithFallbackFlow,
  [SignUpFlowNames.EmailOTPSignupWithPasskey]: VerificationMethodSignupWithPasskeyFlow,
  [LoginFlowNames.PasskeyLoginWithEmailOTPFallback]: PasskeyLoginWithEmailOTPFallbackFlow,
};
export * from './signup/passkeySignupWithFallbackFlow';
export * from './login/passkeyLoginWithOtpFlow';
