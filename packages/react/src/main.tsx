import './i18n';

import { FlowType, handleTheming } from '@corbado/shared-ui';
import type { CorbadoAuthUIProps } from '@corbado/types';
import React from 'react';

import FlowHandlerProvider from './contexts/FlowHandlerProvider';
import { defaultLanguage as defaultAppLanguage, handleDynamicLocaleSetup } from './i18n';
import { ScreensFlow } from './screens/ScreenFlow';

const CorbadoAuthUI = ({
  onLoggedIn,
  defaultLanguage = defaultAppLanguage,
  autoDetectLanguage = true,
  customTranslations = null,
  darkMode = 'auto',
  theme,
  isDevMode = false,
  customerSupportEmail = '',
}: CorbadoAuthUIProps) => {
  React.useEffect(() => {
    handleDynamicLocaleSetup(autoDetectLanguage, defaultLanguage, customTranslations);
    const themesCleanup = handleTheming(darkMode, theme);

    return themesCleanup;
  }, []);

  return (
    <div className='cb-container'>
      <FlowHandlerProvider
        onLoggedIn={onLoggedIn}
        initialFlowType={FlowType.SignUp}
      >
        <ScreensFlow
          isDevMode={isDevMode}
          customerSupportEmail={customerSupportEmail}
        />
      </FlowHandlerProvider>
    </div>
  );
};
export default CorbadoAuthUI;
