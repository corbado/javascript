import './i18n';
import './styles/index.css';
import './styles/themes/emerald-funk.css';

import { FlowType } from '@corbado/web-core';
import React from 'react';

import FlowHandlerProvider from './contexts/FlowHandlerProvider';
import UserDataProvider from './contexts/UserDataProvider';
import { defaultLanguage as defaultAppLanguage, handleDynamicLocaleSetup } from './i18n';
import { ScreensFlow } from './screens/ScreenFlow';
import type { CorbadoThemes } from './utils/themes';

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
  darkMode?: boolean;

  // A boolean indicating whether the app's theme should be automatically set based on the system's theme. If this is enabled, the value of darkMode is ignored.
  autoDetectSystemTheme?: boolean;

  // The theme to be used for the app. Corbado provides custom themes for the app.
  theme?: CorbadoThemes;
}

const CorbadoAuthUI = ({
  onLoggedIn,
  defaultLanguage = defaultAppLanguage,
  autoDetectLanguage = true,
  customTranslations = null,
  darkMode = false,
  autoDetectSystemTheme = false,
  theme,
}: Props) => {
  React.useEffect(() => {
    let darkModeListener: ((e: MediaQueryListEvent) => void) | null = null;
    handleDynamicLocaleSetup(autoDetectLanguage, defaultLanguage, customTranslations);

    if (autoDetectSystemTheme) {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      darkModeListener = (e: MediaQueryListEvent) => {
        if (e.matches) {
          document.body.classList.add('dark');
        } else {
          document.body.classList.remove('dark');
        }
      };

      darkModeMediaQuery.addEventListener('change', darkModeListener);
    }

    if (darkMode) {
      document.body.classList.add('dark');
    }

    if (theme) {
      document.body.classList.add('cb-green-theme');
    }

    return () => {
      if (autoDetectSystemTheme && darkModeListener) {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        darkModeMediaQuery.removeEventListener('change', darkModeListener);
      }
    };
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
