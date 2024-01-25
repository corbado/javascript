import { createContext, useState } from 'react';

interface Customizations {
  customTheme: string;
  customTranslation: Record<string, object> | null | undefined;
  darkMode: 'on' | 'off' | 'auto';
  setCustomTheme: (theme: string) => void;
  setCustomTranslation: (translation: Record<string, object> | null | undefined) => void;
  setDarkMode: (mode: 'on' | 'off' | 'auto') => void;
}

export const CustomizationsContext = createContext<Customizations>({
  customTheme: '',
  customTranslation: null,
  darkMode: 'auto',
  setCustomTheme: () => void 0,
  setCustomTranslation: () => void 0,
  setDarkMode: () => void 0,
});

export const CustomizationsProvider = ({ children }: { children: React.ReactNode }) => {
  const [customTheme, setCustomTheme] = useState<string>('');
  const [customTranslation, setCustomTranslation] = useState<Record<string, object> | null | undefined>(null);
  const [darkMode, setDarkMode] = useState<'on' | 'off' | 'auto'>('auto');

  return (
    <CustomizationsContext.Provider
      value={{
        customTheme,
        customTranslation,
        darkMode,
        setCustomTheme,
        setCustomTranslation,
        setDarkMode,
      }}
    >
      {children}
    </CustomizationsContext.Provider>
  );
};
