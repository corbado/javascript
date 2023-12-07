import './i18n';
import './styles/index.css';
import './styles/themes/emerald-funk.css';
import './styles/themes/dark.css';

import { FlowType } from '@corbado/web-core';
import React from 'react';

import FlowHandlerProvider from './contexts/FlowHandlerProvider';
import UserDataProvider from './contexts/UserDataProvider';
import { defaultLanguage as defaultAppLanguage, handleDynamicLocaleSetup } from './i18n';
import { ScreensFlow } from './screens/ScreenFlow';
import type { ICustomThemes } from './types/themes';
import { handleTheming } from './utils/themes';

/**
 * Interface for the properties accepted by the CorbadoAuthUI component.
 *
 * @interface CorbadoProps
 * @property {() => void} onLoggedIn - A callback function that is called when the user is logged in.
 * @property {string} [defaultLanguage] - The default language to be used if auto-detection is disabled or fails. Defaults to 'en' if not provided.
 * @property {boolean} [autoDetectLanguage] - A boolean indicating whether the user's language should be auto-detected. Defaults to true if not provided.
 * @property {Record<string, object> | null} [customTranslations] - An object containing custom translations. Each key should be a language code and each value should be an object containing the translations for that language.
 * @property {'on' | 'off' | 'auto'} [darkMode] - A string indicating the dark mode preference. Defaults to 'auto' if not provided.
 * @property {string | ICustomThemes} [theme] - A string or an object indicating the theme preference. If it's a string, it should be a predefined theme name. If it's an object, it should be an ICustomThemes object containing custom light and dark themes.
 */
interface CorbadoProps {
  onLoggedIn: () => void;
  defaultLanguage?: string;
  autoDetectLanguage?: boolean;
  customTranslations?: Record<string, object> | null;
  darkMode?: 'on' | 'off' | 'auto';
  theme?: string | ICustomThemes;
}

const CorbadoAuthUI = ({
  onLoggedIn,
  defaultLanguage = defaultAppLanguage,
  autoDetectLanguage = true,
  customTranslations = null,
  darkMode = 'auto',
  theme,
}: CorbadoProps) => {
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
