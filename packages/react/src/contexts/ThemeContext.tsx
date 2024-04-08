import type { CustomThemes } from '@corbado/types';
import { createContext } from 'react';

export interface ThemeContextProps {
  theme?: string | CustomThemes;
  darkMode?: boolean;
  themeUpdateTS: number;
}

export const initialContext: ThemeContextProps = {
  theme: '',
  darkMode: false,
  themeUpdateTS: 0,
};

const ThemeContext = createContext<ThemeContextProps>(initialContext);

export default ThemeContext;
