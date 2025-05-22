import { createContext } from 'react';

export interface TelemetryConfig {
  projectId: string;
  disabled?: boolean;
  mode?: 'debug' | 'production';
}

interface TelemetryContextType {
  telemetryConfig: TelemetryConfig;
  setTelemetryConfig: (config: TelemetryConfig | ((prev: TelemetryConfig) => TelemetryConfig)) => void;
}

export const TelemetryContext = createContext<TelemetryContextType | null>(null);
