import '../i18n';

import type { BehaviorSubject } from '@corbado/shared-ui';
import { handleTheming } from '@corbado/shared-ui';
import type { CorbadoConfig } from '@corbado/types';
import type { CorbadoApp } from '@corbado/web-core';
import type { FC, PropsWithChildren } from 'react';
import React, { useEffect } from 'react';

import { CorbadoSessionProvider } from '../contexts/CorbadoSessionProvider';
import ErrorHandlingProvider from '../contexts/ErrorHandlingProvider';
import { ThemeProvider } from '../contexts/ThemeProvider';
import { handleDynamicLocaleSetup } from '../i18n';

export interface CorbadoProviderProps extends PropsWithChildren<CorbadoConfig> {
  corbadoAppInstance?: CorbadoApp;
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
    <CorbadoSessionProvider
      corbadoAppInstance={corbadoAppInstance}
      corbadoAppParams={corbadoAppParams}
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
  );
};
export default CorbadoProvider;
