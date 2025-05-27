import '../i18n';

import type { BehaviorSubject } from '@corbado/shared-ui';
import { handleTheming } from '@corbado/shared-ui';
import type { CorbadoConfig } from '@corbado/types';
import type { CorbadoApp } from '@corbado/web-core';
import type { FC, PropsWithChildren } from 'react';
import React, { useEffect } from 'react';

import { CorbadoSessionProvider } from '../contexts/CorbadoSessionProvider';
import ErrorHandlingProvider from '../contexts/ErrorHandlingProvider';
import { TelemetryProvider } from '../contexts/TelemetryProvider';
import { ThemeProvider } from '../contexts/ThemeProvider';
import { handleDynamicLocaleSetup } from '../i18n';

export type TelemetryConfig =
  | false
  | {
      debug?: boolean;
      disabled?: boolean;
    };

export interface CorbadoProviderProps extends PropsWithChildren<CorbadoConfig> {
  corbadoAppInstance?: CorbadoApp;
  telemetry?: TelemetryConfig;
}

const CorbadoProvider: FC<CorbadoProviderProps> = ({
  children,
  defaultLanguage,
  autoDetectLanguage,
  customTranslations,
  darkMode,
  theme,
  corbadoAppInstance,
  customerSupportEmail,
  isDevMode,
  projectId,
  telemetry,
  isPreviewMode,
  ...corbadoAppParams
}) => {
  const [darkModeState, setDarkModeState] = React.useState<BehaviorSubject<boolean> | undefined>();

  useEffect(() => {
    handleDynamicLocaleSetup(autoDetectLanguage, defaultLanguage, customTranslations);
  }, [autoDetectLanguage, defaultLanguage, customTranslations]);

  useEffect(() => {
    const { darkModeState, removeTheme } = handleTheming(darkMode ?? 'auto', theme);
    setDarkModeState(darkModeState);

    return removeTheme;
  }, [darkMode, theme]);

  return (
    <TelemetryProvider
      telemetryConfig={{
        projectId,
        disabled: telemetry === false || telemetry?.disabled === true,
        isDebugMode: telemetry && telemetry.debug,
        isPreviewMode,
        isDevMode,
        hasCustomerSupportEmail: Boolean(customerSupportEmail),
        hasCustomTranslations: Boolean(customTranslations),
        isAutoDetectLanguageEnabled: autoDetectLanguage,
        defaultLanguage,
        isDefaultTheme: theme === undefined,
        darkMode,
      }}
    >
      <CorbadoSessionProvider
        corbadoAppInstance={corbadoAppInstance}
        corbadoAppParams={{
          ...corbadoAppParams,
          projectId,
        }}
      >
        <ErrorHandlingProvider
          customerSupportEmail={customerSupportEmail ?? ''}
          isDevMode={isDevMode ?? false}
        >
          <ThemeProvider
            theme={theme}
            darkModeSubject={darkModeState}
          >
            {children}
          </ThemeProvider>
        </ErrorHandlingProvider>
      </CorbadoSessionProvider>
    </TelemetryProvider>
  );
};
export default CorbadoProvider;
