import { LoginFlowNames, SignUpFlowNames } from '../constants';
import type { Flows } from '../types';
import { PasskeyLoginWithEmailOTPFallbackFlow } from './passkeyLoginWithOtpFlow';
import { PasskeySignupWithEmailOTPFallbackFlow } from './passkeySignupWithOtpFlow';

export const flows: Flows = {
  [SignUpFlowNames.PasskeySignupWithEmailOTPFallback]: PasskeySignupWithEmailOTPFallbackFlow,
  [LoginFlowNames.PasskeyLoginWithEmailOTPFallback]: PasskeyLoginWithEmailOTPFallbackFlow,
};
export * from './passkeySignupWithOtpFlow';
export * from './passkeyLoginWithOtpFlow';
