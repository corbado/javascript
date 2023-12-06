export enum CorbadoThemes {
  EmeraldFunk = 'emerald-funk',
}

export const loadTheme = (theme: CorbadoThemes | undefined) => {
  if (theme) {
    document.body.classList.add(`cb-${theme}-theme`);
  }
};

const addDarkMode = () => {
  if (document.body.classList.contains('dark')) {
    return;
  }

  document.body.classList.add('dark');
};

const removeDarkMode = () => {
  document.body.classList.remove('dark');
};

const autoDetectSystemTheme = () => {
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const darkModeListener = (e: MediaQueryListEvent) => {
    if (e.matches) {
      addDarkMode();
    } else {
      removeDarkMode();
    }
  };

  darkModeMediaQuery.addEventListener('change', darkModeListener);

  if (darkModeMediaQuery.matches) {
    addDarkMode();
  } else {
    removeDarkMode();
  }

  return () => {
    darkModeMediaQuery.removeEventListener('change', darkModeListener);
  };
};

export const handleDarkMode = (darkMode: 'on' | 'off' | 'auto') => {
  let removeDarkModeListener: (() => void) | undefined;
  switch (darkMode) {
    case 'on':
      addDarkMode();
      break;
    case 'off':
      removeDarkMode();
      break;
    case 'auto':
      removeDarkModeListener = autoDetectSystemTheme();
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
