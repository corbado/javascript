import { LoginFlowNames, SignUpFlowNames } from '../constants';
import type { Flows } from '../types';
import { PasskeyLoginWithEmailOTPFallbackFlow } from './login/passkeyLoginWithOtpFlow';
import { PasskeySignupWithEmailOTPFallbackFlow } from './signup/passkeySignupWithOtpFlow';

export const flows: Flows = {
  [SignUpFlowNames.PasskeySignupWithEmailOTPFallback]: PasskeySignupWithEmailOTPFallbackFlow,
  [LoginFlowNames.PasskeyLoginWithEmailOTPFallback]: PasskeyLoginWithEmailOTPFallbackFlow,
};
export * from './signup/passkeySignupWithOtpFlow';
export * from './login/passkeyLoginWithOtpFlow';
