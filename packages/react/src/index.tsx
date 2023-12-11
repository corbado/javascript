import './i18n';

import { CorbadoProvider, useCorbado } from '@corbado/react-sdk';
import { FlowType, handleTheming } from '@corbado/shared-ui';
import type { CorbadoAuthUIProps } from '@corbado/types';
import React from 'react';

import FlowHandlerProvider from './contexts/FlowHandlerProvider';
import UserDataProvider from './contexts/UserDataProvider';
import { defaultLanguage as defaultAppLanguage, handleDynamicLocaleSetup } from './i18n';
import { ScreensFlow } from './screens/ScreenFlow';

export { CorbadoProvider, useCorbado };
export const CorbadoAuthUI = ({
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
