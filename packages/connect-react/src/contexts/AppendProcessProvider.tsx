import type { CorbadoConnectAppendConfig } from '@corbado/types';
import { ConnectService } from '@corbado/web-core';
import type { FC, PropsWithChildren } from 'react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import type { AppendScreenType } from '../types/ScreenType';
import type { AppendProcessContextProps } from './AppendProcessContext';
import AppendProcessContext from './AppendProcessContext';

type Props = {
  config: CorbadoConnectAppendConfig;
  initialScreenType: AppendScreenType;
};

export const AppendProcessProvider: FC<PropsWithChildren<Props>> = ({ children, initialScreenType, config }) => {
  const [currentScreenType, setCurrentScreenType] = useState<AppendScreenType>(initialScreenType);
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

  const navigateToScreen = useCallback((screenType: AppendScreenType) => {
    setCurrentScreenType(screenType);
  }, []);

  const getConnectService = useCallback(() => {
    return connectService;
  }, [connectService]);

  const contextValue = useMemo<AppendProcessContextProps>(
    () => ({
      currentScreenType,
      navigateToScreen,
      getConnectService,
      config,
    }),
    [currentScreenType, navigateToScreen, connectService, config],
  );

  return <AppendProcessContext.Provider value={contextValue}>{children}</AppendProcessContext.Provider>;
};

export default AppendProcessProvider;
