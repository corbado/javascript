import React, { createContext, useState, useEffect, FC, PropsWithChildren } from 'react';

const defaultState = {
  darkMode: false,
  toggleDarkMode: () => {},
};

const ThemeContext = createContext(defaultState);

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [darkMode, setDark] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDark(isDark);
  }, []);

  const toggleDarkMode = () => {
    localStorage.setItem('darkMode', String(!darkMode));
    setDark(!darkMode);
  };

  return <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>{children}</ThemeContext.Provider>;
};

export default ThemeContext;
