import './i18n';
import './styles/index.css';
import './styles/themes/emerald-funk.css';

import { FlowType } from '@corbado/web-core';
import React from 'react';

import FlowHandlerProvider from './contexts/FlowHandlerProvider';
import UserDataProvider from './contexts/UserDataProvider';
import { defaultLanguage as defaultAppLanguage, handleDynamicLocaleSetup } from './i18n';
import { ScreensFlow } from './screens/ScreenFlow';
import { type CorbadoThemes, handleDarkMode, loadTheme } from './utils/themes';

interface Props {
  // A callback function that is called when the user is logged in.
  onLoggedIn: () => void;

  // The default language to be used if auto-detection is disabled or fails. Defaults to 'en' if not provided.
  defaultLanguage?: string;

  // A boolean indicating whether the user's language should be auto-detected. Defaults to true if not provided.
  autoDetectLanguage?: boolean;

  // An object containing custom translations. Each key should be a language code and each value should be an object containing the translations for that language.
  customTranslations?: Record<string, object> | null;

  // A boolean indicating whether the app should be displayed in dark mode. This value is only used if autoDetectSystemTheme is disabled.
  darkMode?: 'on' | 'off' | 'auto';

  // The theme to be used for the app. Corbado provides custom themes for the app.
  theme?: CorbadoThemes;
}

const CorbadoAuthUI = ({
  onLoggedIn,
  defaultLanguage = defaultAppLanguage,
  autoDetectLanguage = true,
  customTranslations = null,
  darkMode = 'auto',
  theme,
}: Props) => {
  React.useEffect(() => {
    handleDynamicLocaleSetup(autoDetectLanguage, defaultLanguage, customTranslations);
    const removeDarkModeListener = handleDarkMode(darkMode);
    loadTheme(theme);

    return removeDarkModeListener;
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
