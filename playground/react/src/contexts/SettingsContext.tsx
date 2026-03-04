'use client';

import { createContext, useEffect, useState, type FC, type PropsWithChildren } from 'react';

const defaultState = {
  darkMode: false,
  toggleDarkMode: () => {},
  projectId: '',
  updateProjectId: (projectIdParam: string) => {
    void projectIdParam;
  },
};

const SettingsContext = createContext(defaultState);

const setProjectIdInLocalStorage = (projectId: string) => {
  if (typeof window === 'undefined') {
    return;
  }

  const currentProjectId = localStorage.getItem('projectId');
  if (currentProjectId && currentProjectId !== projectId) {
    localStorage.clear();
  }

  localStorage.setItem('projectId', projectId);
};

const getProjectIdFromURL = () => {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_CORBADO_PROJECT_ID || 'pro-1';
  }

  const projectIdFromURL = window.location.pathname.split('/')[1];
  const projectId = projectIdFromURL.startsWith('pro-') ? projectIdFromURL : 'pro-1';

  setProjectIdInLocalStorage(projectId);

  return projectId;
};

export const SettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [projectId, setProjectId] = useState(() => getProjectIdFromURL());
  const [darkMode, setDark] = useState(false);

  useEffect(() => {
    setProjectId(getProjectIdFromURL());
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDark(isDark);
  }, []);

  const toggleDarkMode = () => {
    localStorage.setItem('darkMode', String(!darkMode));
    setDark(!darkMode);
  };

  const updateProjectId = (newProjectId: string) => {
    if (projectId !== newProjectId) {
      setProjectIdInLocalStorage(newProjectId);
      setProjectId(newProjectId);
    }
  };

  return (
    <SettingsContext.Provider value={{ darkMode, toggleDarkMode, projectId, updateProjectId }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
