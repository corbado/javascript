import type { FC, PropsWithChildren } from 'react';
import { useMemo, useState } from 'react';

import type { AuthUIContextInterface, UserState } from './AuthUIContext.ts';
import AuthUIContext, { AuthScreenNames } from './AuthUIContext.ts';
import { useNavigate } from 'react-router-dom';

export const AuthUIProvider: FC<PropsWithChildren> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<AuthScreenNames>(AuthScreenNames.InitiateSignUp);
  const [userState, setUserState] = useState<UserState | undefined>();
  const navigate = useNavigate();

  const switchScreen = (screen: AuthScreenNames) => {
    setCurrentScreen(screen);
  };

  const onAuthCompleted = () => {
    navigate('/home');
  };

  const contextValue = useMemo<AuthUIContextInterface>(
    () => ({
      currentScreen,
      userState,
      switchScreen,
      setUserState,
      onAuthCompleted,
    }),
    [currentScreen, userState],
  );

  return <AuthUIContext.Provider value={contextValue}>{children}</AuthUIContext.Provider>;
};
