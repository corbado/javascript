import type { ScreenNames } from '@corbado/shared-ui';
import { type FlowNames, LoginFlowNames, SignUpFlowNames } from '@corbado/shared-ui';
import type React from 'react';

import { PasskeyLoginWithFallbackFlow } from './PasskeyLoginWithFallbackFlow';
import { PasskeySignupWithFallbackFlow } from './PasskeySignupWithFallbackFlow';
import { SignupWithPasskeyAppendFlow } from './SignupWithPasskeyAppend';

export type ScreenMap = {
  [K in ScreenNames]?: () => React.ReactNode;
};

export type FlowScreensMap = {
  [K in FlowNames]?: ScreenMap;
};

export const flowScreensMap: FlowScreensMap = {
  [SignUpFlowNames.PasskeySignupWithFallback]: PasskeySignupWithFallbackFlow,
  [SignUpFlowNames.SignupWithPasskeyAppend]: SignupWithPasskeyAppendFlow,
  [LoginFlowNames.PasskeyLoginWithFallback]: PasskeyLoginWithFallbackFlow,
};
