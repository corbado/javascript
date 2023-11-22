import type { ScreenNames } from '@corbado/web-core';
import { type FlowNames, SignUpFlowNames } from '@corbado/web-core';
import type React from 'react';

import { PasskeySignupWithEmailOTPFallbackFlow } from './PasskeySignupWithEmailOTPFallbackFlow';

export type ScreenMap = {
  [K in ScreenNames]?: () => React.ReactNode;
};

export type FlowScreensMap = {
  [K in FlowNames]?: ScreenMap;
};

export const flowScreensMap: FlowScreensMap = {
  [SignUpFlowNames.PasskeySignupWithEmailOTPFallback]: PasskeySignupWithEmailOTPFallbackFlow,
};
