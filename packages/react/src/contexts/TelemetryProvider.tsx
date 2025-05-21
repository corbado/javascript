import type { ReactNode } from 'react';
import React from 'react';

import type { TelemetryConfig } from './TelemetryContext';
import { TelemetryContext } from './TelemetryContext';

interface TelemetryProviderProps {
  children: ReactNode;
  telemetryConfig: TelemetryConfig;
}

export function TelemetryProvider({ children, telemetryConfig }: TelemetryProviderProps) {
  return <TelemetryContext.Provider value={{ telemetryConfig }}>{children}</TelemetryContext.Provider>;
}
