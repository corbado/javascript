import '../i18n';

import type { CorbadoProviderParams } from '@corbado/react-sdk';
import { CorbadoProvider as CorbadoSDKProvider } from '@corbado/react-sdk';
import { handleTheming } from '@corbado/shared-ui';
import type { CorbadoUIConfig } from '@corbado/types';
import type { FC, PropsWithChildren } from 'react';
import React, { useEffect } from 'react';

import ErrorHandlingProvider from '../contexts/ErrorHandlingProvider';
import { handleDynamicLocaleSetup } from '../i18n';

export type CorbadoProviderProps = PropsWithChildren<CorbadoUIConfig & CorbadoProviderParams>;

const CorbadoProvider: FC<CorbadoProviderProps> = ({ children, ...config }) => {
  const { defaultLanguage, autoDetectLanguage, customTranslations, darkMode, theme, ...providerConfig } = config;

  useEffect(() => {
    handleDynamicLocaleSetup(autoDetectLanguage, defaultLanguage, customTranslations);
    const themesCleanup = handleTheming(darkMode ?? 'auto', theme);

    return themesCleanup;
  }, []);

  useEffect(() => {
    handleDynamicLocaleSetup(autoDetectLanguage, defaultLanguage, customTranslations);
  }, [autoDetectLanguage, defaultLanguage, customTranslations]);

  useEffect(() => {
    const themesCleanup = handleTheming(darkMode ?? 'auto', theme);

    return themesCleanup;
  }, [darkMode, theme]);

  return (
    <CorbadoSDKProvider {...providerConfig}>
      <ErrorHandlingProvider
        customerSupportEmail={config.customerSupportEmail ?? ''}
        isDevMode={config.isDevMode ?? false}
      >
        {children}
      </ErrorHandlingProvider>
    </CorbadoSDKProvider>
  );
};
export default CorbadoProvider;
