import type { BehaviorSubject } from '@corbado/shared-ui';
import type { CustomThemes } from '@corbado/types';
import type { FC, PropsWithChildren } from 'react';
import React, { useEffect, useState } from 'react';

import ThemeContext from './ThemeContext';

interface ThemeProviderProps extends PropsWithChildren {
  theme?: string | CustomThemes;
  darkMode?: 'on' | 'off' | 'auto';
  darkModeSubject: BehaviorSubject<boolean> | undefined;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children, theme, darkModeSubject }) => {
  const [themeState, setThemeState] = useState(theme);
  const [darkMode, setDarkMode] = useState<boolean>(darkModeSubject?.getValue() ?? false);
  const [themeUpdateTS, setThemeUpdatedTs] = useState(0);

  useEffect(() => {
    const observerCallback = () => {
      setThemeUpdatedTs(Date.now());
    };

    const observer = new MutationObserver(observerCallback);

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
      childList: false,
      subtree: false,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    updateTheme(theme ?? '');
  }, [theme]);

  useEffect(() => {
    if (!darkModeSubject) {
      return;
    }

    darkModeSubject.subscribe(isDarkMode => {
      setDarkMode(isDarkMode);
    });

    return () => {
      darkModeSubject.unsubscribe();
    };
  }, [darkModeSubject]);

  const updateTheme = (theme: string | CustomThemes) => {
    setThemeState(theme);
    setThemeUpdatedTs(Date.now());
  };

  return (
    <ThemeContext.Provider value={{ theme: themeState, darkMode, themeUpdateTS }}>{children}</ThemeContext.Provider>
  );
};
