import type { ScreenNames } from '@corbado/shared-ui';
import { type FlowNames, LoginFlowNames, SignUpFlowNames } from '@corbado/shared-ui';
import type React from 'react';

import { EmailOTPSignupWithPasskeyFlow } from './EmailOTPSignupWithPasskey';
import { PasskeyLoginWithEmailOTPFallbackFlow } from './PasskeyLoginWithEmailOTPFallbackFlow';
import { PasskeySignupWithEmailOTPFallbackFlow } from './PasskeySignupWithEmailOTPFallbackFlow';

export type ScreenMap = {
  [K in ScreenNames]?: () => React.ReactNode;
};

export type FlowScreensMap = {
  [K in FlowNames]?: ScreenMap;
};

export const flowScreensMap: FlowScreensMap = {
  [SignUpFlowNames.PasskeySignupWithEmailOTPFallback]: PasskeySignupWithEmailOTPFallbackFlow,
  [SignUpFlowNames.EmailOTPSignupWithPasskey]: EmailOTPSignupWithPasskeyFlow,
  [LoginFlowNames.PasskeyLoginWithEmailOTPFallback]: PasskeyLoginWithEmailOTPFallbackFlow,
};
