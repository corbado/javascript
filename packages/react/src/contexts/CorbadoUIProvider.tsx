import type { CorbadoUIConfig } from '@corbado/types';
import type { FC, PropsWithChildren } from 'react';
import React, { useMemo } from 'react';

import { defaultLanguage } from '../i18n';
import { CorbadoUIContext } from './CorbadoUIContext';

const CorbadoUIProvider: FC<PropsWithChildren<CorbadoUIConfig>> = ({ children, darkMode = 'auto', ...configProps }) => {
  const config = {
    autoDetectLanguage: true,
    defaultLanguage: defaultLanguage,
    customTranslations: null,
    onLoggedIn: () => void 0,
    darkMode,
    ...configProps,
  };

  const contextValue = useMemo(
    () => ({
      config,
    }),
    [config],
  );

  return <CorbadoUIContext.Provider value={contextValue}>{children}</CorbadoUIContext.Provider>;
};

export default CorbadoUIProvider;
