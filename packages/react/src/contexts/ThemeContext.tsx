import type { CustomThemes } from '@corbado/types';
import { createContext } from 'react';

export interface ThemeContextProps {
  theme?: string | CustomThemes;
  darkMode?: 'on' | 'off' | 'auto';
  themeUpdateTS: number;
  updateTheme: (theme: string | CustomThemes, darkMode: 'on' | 'off' | 'auto') => void;
}

export const initialContext: ThemeContextProps = {
  theme: '',
  darkMode: 'auto',
  themeUpdateTS: 0,
  updateTheme: () => void 0,
};

const ThemeContext = createContext<ThemeContextProps>(initialContext);

export default ThemeContext;
