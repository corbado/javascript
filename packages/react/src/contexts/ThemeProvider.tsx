import type { CustomThemes } from '@corbado/types';
import type { FC, PropsWithChildren } from 'react';
import React, { useEffect, useState } from 'react';

import ThemeContext from './ThemeContext';

interface ThemeProviderProps extends PropsWithChildren {
  theme?: string | CustomThemes;
  darkMode?: 'on' | 'off' | 'auto';
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children, theme, darkMode }) => {
  const [themeState, setThemeState] = useState(theme);
  const [darkModeState, setDarkModeState] = useState(darkMode);
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
    updateTheme(theme ?? '', darkMode ?? 'auto');
  }, [theme, darkMode]);

  const updateTheme = (theme: string | CustomThemes, darkMode: 'on' | 'off' | 'auto') => {
    setThemeState(theme);
    setDarkModeState(darkMode);
    setThemeUpdatedTs(Date.now());
  };

  return (
    <ThemeContext.Provider value={{ theme: themeState, darkMode: darkModeState, themeUpdateTS, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
