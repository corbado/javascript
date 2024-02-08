import { useContext } from 'react';

import type { ThemeContextProps } from '../contexts/ThemeContext';
import ThemeContext from '../contexts/ThemeContext';

export const useTheme = (context = ThemeContext): ThemeContextProps => useContext(context);

export default useTheme;
