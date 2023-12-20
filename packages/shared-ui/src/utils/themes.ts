import type { CustomThemes } from '@corbado/types';

const loadTheme = (theme: string | CustomThemes, isDarkMode: boolean) => {
  const classList = document.body.classList;
  const newClass = typeof theme === 'string' ? theme : isDarkMode ? theme.dark : theme.light;

  if (classList.contains(newClass)) {
    classList.remove(newClass);
  }

  classList.add(newClass);
};

export const hasDarkMode = () => {
  return document.body.classList.contains('dark');
};

const addDarkMode = () => {
  if (hasDarkMode()) {
    return;
  }

  document.body.classList.add('dark');
};

const removeDarkMode = () => {
  document.body.classList.remove('dark');
};

const autoDetectSystemTheme = (customTheme?: string | CustomThemes) => {
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const darkModeListener = (e: MediaQueryListEvent) => {
    if (e.matches) {
      addDarkMode();
    } else {
      removeDarkMode();
    }

    if (customTheme) {
      loadTheme(customTheme, e.matches);
    }
  };

  darkModeMediaQuery.addEventListener('change', darkModeListener);

  if (darkModeMediaQuery.matches) {
    addDarkMode();
  } else {
    removeDarkMode();
  }

  if (customTheme) {
    loadTheme(customTheme, darkModeMediaQuery.matches);
  }

  return () => {
    darkModeMediaQuery.removeEventListener('change', darkModeListener);
  };
};

export const handleTheming = (darkMode: 'on' | 'off' | 'auto', customTheme?: string | CustomThemes) => {
  let removeDarkModeListener: (() => void) | undefined;
  switch (darkMode) {
    case 'on':
      addDarkMode();

      if (customTheme) {
        loadTheme(customTheme, true);
      }
      break;
    case 'off':
      removeDarkMode();

      if (customTheme) {
        loadTheme(customTheme, false);
      }
      break;
    case 'auto':
      removeDarkModeListener = autoDetectSystemTheme(customTheme);
      break;
    default:
      break;
  }

  return () => {
    if (darkMode === 'auto' && removeDarkModeListener) {
      removeDarkModeListener();
    }
  };
};

export enum CorbadoThemes {
  EmeraldFunk = 'cb-emerald-funk-theme',
}
