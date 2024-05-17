import { createContext, FC, PropsWithChildren, useEffect, useState } from 'react';

const defaultState = {
  darkMode: false,
  toggleDarkMode: () => {},
  projectId: '',
  updateProjectId: (_: string) => {},
};

const SettingsContext = createContext(defaultState);
const setProjectIdInLocalStorage = (projectId: string) => {
  const currentProjectId = localStorage.getItem('projectId');
  if (currentProjectId && currentProjectId !== projectId) {
    localStorage.clear();
  }

  localStorage.setItem('projectId', projectId);
};

const getProjectIdFromURL = () => {
  const projectIdFromURL = window.location.pathname.split('/')[1];
  const projectId = projectIdFromURL.startsWith('pro-') ? projectIdFromURL : 'pro-1';

  setProjectIdInLocalStorage(projectId);

  return projectId;
};

export const SettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [projectId, setProjectId] = useState(getProjectIdFromURL());
  const [darkMode, setDark] = useState(false);

  useEffect(() => {
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
