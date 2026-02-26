import '../i18n';

import type { BehaviorSubject } from '../shared-ui';
import { handleTheming } from '../shared-ui';
import type { CorbadoConfig } from '@corbado/types';
import type { CorbadoApp } from '@corbado/web-core';
import type { FC, PropsWithChildren } from 'react';
import React, { useEffect, useMemo } from 'react';

import { init as initObserve } from '@corbado/observe';

import { CorbadoSessionProvider } from '../contexts/CorbadoSessionProvider';
import ErrorHandlingProvider from '../contexts/ErrorHandlingProvider';
import { ObserveContext } from '../contexts/ObserveContext';
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
  observeEnabled?: boolean;
}

function deriveObserveApiBaseUrl(frontendApiUrlSuffix?: string): string {
  const suffix = frontendApiUrlSuffix ?? 'frontendapi.corbado.io';

  if (suffix.includes('corbado-dev.io')) {
    return 'http://localhost:15960';
  }

  return `https://${suffix.replace(/^frontendapi\./, 'api.')}`;
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
  observeEnabled = false,
  ...corbadoAppParams
}) => {
  const [darkModeState, setDarkModeState] = React.useState<BehaviorSubject<boolean> | undefined>();

  const tracker = useMemo(() => {
    if (!observeEnabled) {
      return undefined;
    }

    return initObserve({
      projectId,
      apiBaseUrl: deriveObserveApiBaseUrl(corbadoAppParams.frontendApiUrlSuffix),
      debug: isDevMode ?? false,
    });
  }, [observeEnabled, projectId]);

  useEffect(() => {
    handleDynamicLocaleSetup(autoDetectLanguage, defaultLanguage, customTranslations);
  }, [autoDetectLanguage, defaultLanguage, customTranslations]);

  useEffect(() => {
    const { darkModeState, removeTheme } = handleTheming(darkMode ?? 'auto', theme);
    setDarkModeState(darkModeState);

    return removeTheme;
  }, [darkMode, theme]);

  return (
    <ObserveContext.Provider value={{ tracker }}>
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
    </ObserveContext.Provider>
  );
};
export default CorbadoProvider;
