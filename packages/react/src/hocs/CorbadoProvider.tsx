import '../i18n';

import { CorbadoProvider as CorbadoSDKProvider } from '@corbado/react-sdk';
import { handleTheming } from '@corbado/shared-ui';
import type { CorbadoAppParams, CorbadoUIConfig } from '@corbado/types';
import type { FC, PropsWithChildren } from 'react';
import React, { useEffect } from 'react';

import { handleDynamicLocaleSetup } from '../i18n';

export type CorbadoProviderProps = PropsWithChildren<CorbadoUIConfig & CorbadoAppParams>;

const CorbadoProvider: FC<CorbadoProviderProps> = ({ children, ...config }) => {
  const { defaultLanguage, autoDetectLanguage, customTranslations, darkMode, theme } = config;

  useEffect(() => {
    handleDynamicLocaleSetup(autoDetectLanguage, defaultLanguage, customTranslations);
    const themesCleanup = handleTheming(darkMode ?? 'auto', theme);

    return themesCleanup;
  }, []);

  return (
    <CorbadoSDKProvider
      projectId={config.projectId}
      apiTimeout={config.apiTimeout}
    >
      {children}
    </CorbadoSDKProvider>
  );
};
export default CorbadoProvider;
