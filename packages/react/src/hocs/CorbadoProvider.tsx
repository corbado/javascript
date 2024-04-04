import '../i18n';

import type { CorbadoProviderParams } from '@corbado/react-sdk';
import { CorbadoProvider as CorbadoSDKProvider } from '@corbado/react-sdk';
import type { BehaviorSubject } from '@corbado/shared-ui';
import { handleTheming } from '@corbado/shared-ui';
import type { CorbadoUIConfig } from '@corbado/types';
import type { FC, PropsWithChildren } from 'react';
import React, { useEffect } from 'react';

import ErrorHandlingProvider from '../contexts/ErrorHandlingProvider';
import { ThemeProvider } from '../contexts/ThemeProvider';
import { handleDynamicLocaleSetup } from '../i18n';

export type CorbadoProviderProps = PropsWithChildren<CorbadoUIConfig & CorbadoProviderParams>;

const CorbadoProvider: FC<CorbadoProviderProps> = ({ children, ...config }) => {
  const { defaultLanguage, autoDetectLanguage, customTranslations, darkMode, theme, ...providerConfig } = config;
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
    <CorbadoSDKProvider {...providerConfig}>
      <ErrorHandlingProvider
        customerSupportEmail={config.customerSupportEmail ?? ''}
        isDevMode={config.isDevMode ?? false}
      >
        <ThemeProvider
          theme={theme}
          darkModeSubject={darkModeState}
        >
          {children}
        </ThemeProvider>
      </ErrorHandlingProvider>
    </CorbadoSDKProvider>
  );
};
export default CorbadoProvider;
