import type { CorbadoConnectLoginSecondFactorConfig } from '@corbado/types';
import type { FC, PropsWithChildren } from 'react';
import React, { useCallback, useMemo, useState } from 'react';

import type { Flags } from '../types/flags';
import type { LoginSecondFactorScreenType } from '../types/screenTypes';
import type { LoginSecondFactorProcessContextProps } from './LoginSecondFactorProcessContext';
import LoginSecondFactorProcessContext from './LoginSecondFactorProcessContext';

type Props = {
  config: CorbadoConnectLoginSecondFactorConfig;
  initialScreenType: LoginSecondFactorScreenType;
};

export const LoginSecondFactorProcessProvider: FC<PropsWithChildren<Props>> = ({
  children,
  initialScreenType,
  config,
}) => {
  const [currentScreenType, setCurrentScreenType] = useState<LoginSecondFactorScreenType>(initialScreenType);
  const [currentScreenOptions, setCurrentScreenOptions] = useState<any>();
  const [flags, setFlags] = useState<Flags | undefined>();
  const [loadedMs] = useState<number>(() => Date.now());

  const navigateToScreen = useCallback((screenType: LoginSecondFactorScreenType, options?: any) => {
    setCurrentScreenType(screenType);
    setCurrentScreenOptions(options);
  }, []);

  const contextValue = useMemo<LoginSecondFactorProcessContextProps>(
    () => ({
      currentScreenType,
      navigateToScreen,
      config,
      flags,
      setFlags,
      currentScreenOptions,
      loadedMs,
    }),
    [currentScreenType, navigateToScreen, config, currentScreenOptions, flags],
  );

  return (
    <LoginSecondFactorProcessContext.Provider value={contextValue}>{children}</LoginSecondFactorProcessContext.Provider>
  );
};

export default LoginSecondFactorProcessProvider;
