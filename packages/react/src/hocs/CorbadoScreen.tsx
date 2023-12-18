import '../i18n';

import { handleTheming } from '@corbado/shared-ui';
import type { FC, PropsWithChildren } from 'react';
import { useEffect } from 'react';

import useCorbadoUIContext from '../hooks/useCorbadoUIConfig';
import { handleDynamicLocaleSetup } from '../i18n';

const CorbadoScreen: FC<PropsWithChildren> = ({ children }) => {
  const { defaultLanguage, autoDetectLanguage, customTranslations, darkMode, theme } = useCorbadoUIContext().config;

  useEffect(() => {
    handleDynamicLocaleSetup(autoDetectLanguage, defaultLanguage, customTranslations);
    const themesCleanup = handleTheming(darkMode ?? 'auto', theme);

    return themesCleanup;
  }, []);

  return children;
};

export default CorbadoScreen;
