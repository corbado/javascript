import { createContext } from 'react';

export interface TelemetryConfig {
  projectId: string;
  disabled?: boolean;
  isDebugMode?: boolean;
  isDefaultTheme?: boolean;
  hasCustomerSupportEmail?: boolean;
  darkMode?: 'on' | 'off' | 'auto';
  isAutoDetectLanguageEnabled?: boolean;
  defaultLanguage?: string;
  hasCustomTranslations?: boolean;
  isDevMode?: boolean;
  isPreviewMode?: boolean;
}

interface TelemetryContextType {
  telemetryConfig: TelemetryConfig;
  setTelemetryConfig: (config: TelemetryConfig | ((prev: TelemetryConfig) => TelemetryConfig)) => void;
}

export const TelemetryContext = createContext<TelemetryContextType | null>(null);
