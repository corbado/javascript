import { LoginFlowNames, SignUpFlowNames } from '../constants';
import type { Flows } from '../types';
import { PasskeyLoginWithFallbackFlow } from './login/passkeyLoginWithFallbackFlow';
import { PasskeySignupWithFallbackFlow } from './signup/passkeySignupWithFallbackFlow';
import { SignupWithPasskeyAppendFlow } from './signup/signupWithPasskeyAppend';

export const flows: Flows = {
  [SignUpFlowNames.PasskeySignupWithFallback]: PasskeySignupWithFallbackFlow,
  [SignUpFlowNames.SignupWithPasskeyAppend]: SignupWithPasskeyAppendFlow,
  [LoginFlowNames.PasskeyLoginWithFallback]: PasskeyLoginWithFallbackFlow,
};
export * from './signup/passkeySignupWithFallbackFlow';
export * from './login/passkeyLoginWithFallbackFlow';
