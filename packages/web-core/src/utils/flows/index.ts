import type { Flows } from '../../types';
import { LoginFlowNames, SignUpFlowNames } from '../constants/flowHandler';
import { EmailOTPSignupFlow } from './emailOtpSignupFlow';
import { PasskeyLoginWithEmailOTPFallbackFlow } from './passkeyLoginWithOtpFlow';
import { PasskeySignupWithEmailOTPFallbackFlow } from './passkeySignupWithOtpFlow';

export const flows: Flows = {
  [SignUpFlowNames.PasskeySignupWithEmailOTPFallback]: PasskeySignupWithEmailOTPFallbackFlow,
  [SignUpFlowNames.EmailOTPSignup]: EmailOTPSignupFlow,
  [LoginFlowNames.PasskeyLoginWithEmailOTPFallback]: PasskeyLoginWithEmailOTPFallbackFlow,
};
export * from './emailOtpSignupFlow';
export * from './passkeySignupWithOtpFlow';
export * from './passkeyLoginWithOtpFlow';
