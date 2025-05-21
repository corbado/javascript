import { createContext } from 'react';

export interface TelemetryConfig {
  projectId: string;
  disabled?: boolean;
  mode?: 'debug' | 'production';
}

interface TelemetryContextType {
  telemetryConfig: TelemetryConfig;
}

export const TelemetryContext = createContext<TelemetryContextType | null>(null);
