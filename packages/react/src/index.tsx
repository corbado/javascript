import './i18n';
import './styles.css';

import { FlowType } from '@corbado/web-core';
import React from 'react';

import FlowHandlerProvider from './contexts/FlowHandlerProvider';
import UserDataProvider from './contexts/UserDataProvider';
import { defaultLanguage as defaultAppLanguage, handleDynamicLocaleSetup } from './i18n';
import { ScreensFlow } from './screens/ScreenFlow';

interface Props {
  onLoggedIn: () => void;
  defaultLanguage?: string;
  autoDetectLanguage?: boolean;
  customTranslations?: Record<string, object> | null;
}

const CorbadoAuthUI = ({
  onLoggedIn,
  defaultLanguage = defaultAppLanguage,
  autoDetectLanguage = true,
  customTranslations = null,
}: Props) => {
  React.useEffect(() => {
    handleDynamicLocaleSetup(autoDetectLanguage, defaultLanguage, customTranslations);
  }, []);

  return (
    <div id='corbado-auth'>
      <div className='container'>
        <UserDataProvider>
          <FlowHandlerProvider
            onLoggedIn={onLoggedIn}
            initialFlowType={FlowType.SignUp}
          >
            <ScreensFlow />
          </FlowHandlerProvider>
        </UserDataProvider>
      </div>
    </div>
  );
};

export default CorbadoAuthUI;
