import { LoginFlowNames, SignUpFlowNames } from '../constants';
import type { Flows } from '../types';
import { PasskeyLoginWithEmailOTPFallbackFlow } from './login/passkeyLoginWithOtpFlow';
import { EmailOtpSignupWithPasskeyFlow } from './signup/emailOtpSignupWithPasskey';
import { PasskeySignupWithEmailOTPFallbackFlow } from './signup/passkeySignupWithOtpFlow';

export const flows: Flows = {
  [SignUpFlowNames.PasskeySignupWithEmailOTPFallback]: PasskeySignupWithEmailOTPFallbackFlow,
  [SignUpFlowNames.EmailOTPSignupWithPasskey]: EmailOtpSignupWithPasskeyFlow,
  [LoginFlowNames.PasskeyLoginWithEmailOTPFallback]: PasskeyLoginWithEmailOTPFallbackFlow,
};
export * from './signup/passkeySignupWithOtpFlow';
export * from './login/passkeyLoginWithOtpFlow';
