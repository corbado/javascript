import type { CorbadoConnectLoginConfig } from '@corbado/types';
import { ConnectService } from '@corbado/web-core';
import type { FC, PropsWithChildren } from 'react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import type { LoginScreenType } from '../types/ScreenType';
import type { LoginProcessContextProps } from './LoginProcessContext';
import LoginProcessContext from './LoginProcessContext';

type Props = {
  config: CorbadoConnectLoginConfig;
  initialScreenType: LoginScreenType;
};

export const LoginProcessProvider: FC<PropsWithChildren<Props>> = ({ children, initialScreenType, config }) => {
  const [currentScreenType, setCurrentScreenType] = useState<LoginScreenType>(initialScreenType);
  const [currentIdentifier, setCurrentIdentifier] = useState<string>('');
  const [connectService] = useState(() => {
    return new ConnectService(
      config.projectId,
      config.frontendApiUrlSuffix ?? 'frontendapi.corbado.io',
      config.isDebug ?? false,
    );
  });

  useEffect(() => {
    return () => {
      connectService.dispose();
    };
  }, []);

  const navigateToScreen = useCallback((screenType: LoginScreenType) => {
    setCurrentScreenType(screenType);
  }, []);

  const getConnectService = useCallback(() => {
    return connectService;
  }, [connectService]);

  const contextValue = useMemo<LoginProcessContextProps>(
    () => ({
      currentScreenType,
      navigateToScreen,
      getConnectService,
      config,
      setCurrentIdentifier,
      currentIdentifier,
    }),
    [currentScreenType, navigateToScreen, connectService, config],
  );

  return <LoginProcessContext.Provider value={contextValue}>{children}</LoginProcessContext.Provider>;
};

export default LoginProcessProvider;
