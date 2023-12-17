import './i18n';

import { FlowType, handleTheming } from '@corbado/shared-ui';
import type { CorbadoAuthUIProps } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';

import FlowHandlerProvider from './contexts/FlowHandlerProvider';
import UserDataProvider from './contexts/UserDataProvider';
import { defaultLanguage as defaultAppLanguage, handleDynamicLocaleSetup } from './i18n';
import { ScreensFlow } from './screens/ScreenFlow';

const CorbadoAuthUI: FC<CorbadoAuthUIProps> = ({
  onLoggedIn,
  defaultLanguage = defaultAppLanguage,
  autoDetectLanguage = true,
  customTranslations = null,
  darkMode = 'auto',
  theme,
}: CorbadoAuthUIProps) => {
  React.useEffect(() => {
    handleDynamicLocaleSetup(autoDetectLanguage, defaultLanguage, customTranslations);
    const themesCleanup = handleTheming(darkMode, theme);

    return themesCleanup;
  }, []);

  return (
    <div className='cb-container'>
      <UserDataProvider>
        <FlowHandlerProvider
          onLoggedIn={onLoggedIn}
          initialFlowType={FlowType.SignUp}
        >
          <ScreensFlow />
        </FlowHandlerProvider>
      </UserDataProvider>
    </div>
  );
};
export default CorbadoAuthUI;
