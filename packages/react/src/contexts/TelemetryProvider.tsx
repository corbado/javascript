import type { ReactNode } from 'react';
import React, { useState } from 'react';

import type { TelemetryConfig } from './TelemetryContext';
import { TelemetryContext } from './TelemetryContext';

interface TelemetryProviderProps {
  children: ReactNode;
  telemetryConfig: TelemetryConfig;
}

export function TelemetryProvider({ children, telemetryConfig: initialConfig }: TelemetryProviderProps) {
  const [telemetryConfig, setTelemetryConfig] = useState(initialConfig);

  return (
    <TelemetryContext.Provider value={{ telemetryConfig, setTelemetryConfig }}>{children}</TelemetryContext.Provider>
  );
}
