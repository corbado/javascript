import React, { createContext, FC, PropsWithChildren, useEffect, useState } from 'react';

const defaultState = {
  darkMode: false,
  toggleDarkMode: () => {},
  projectId: '',
};

const SettingsContext = createContext(defaultState);
const getProjectIdFromURL = () => {
  const maybeProjectId = window.location.pathname.split('/')[1];
  if (maybeProjectId.startsWith('pro-')) {
    return maybeProjectId;
  }

  return 'pro-1';
};

export const SettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const projectIdFromURL = getProjectIdFromURL();
  const [darkMode, setDark] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDark(isDark);
  }, []);

  const toggleDarkMode = () => {
    localStorage.setItem('darkMode', String(!darkMode));
    setDark(!darkMode);
  };

  return (
    <SettingsContext.Provider value={{ darkMode, toggleDarkMode, projectId: projectIdFromURL }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
