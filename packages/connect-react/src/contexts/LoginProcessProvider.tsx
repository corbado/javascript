import type { CorbadoConnectLoginConfig } from '@corbado/types';
import type { FC, PropsWithChildren } from 'react';
import React, { useCallback, useMemo, useState } from 'react';

import type { Flags } from '../types/flags';
import type { LoginScreenType } from '../types/screenTypes';
import type { LoginProcessContextProps } from './LoginProcessContext';
import LoginProcessContext from './LoginProcessContext';

type Props = {
  config: CorbadoConnectLoginConfig;
  initialScreenType: LoginScreenType;
};

export const LoginProcessProvider: FC<PropsWithChildren<Props>> = ({ children, initialScreenType, config }) => {
  const [currentScreenType, setCurrentScreenType] = useState<LoginScreenType>(initialScreenType);
  const [currentIdentifier, setCurrentIdentifier] = useState<string>('');
  const [flags, setFlags] = useState<Flags | undefined>(undefined);

  const navigateToScreen = useCallback((screenType: LoginScreenType) => {
    setCurrentScreenType(screenType);
  }, []);

  const contextValue = useMemo<LoginProcessContextProps>(
    () => ({
      currentScreenType,
      navigateToScreen,
      config,
      setCurrentIdentifier,
      currentIdentifier,
      flags,
      setFlags,
    }),
    [currentScreenType, navigateToScreen, config],
  );

  return <LoginProcessContext.Provider value={contextValue}>{children}</LoginProcessContext.Provider>;
};

export default LoginProcessProvider;
