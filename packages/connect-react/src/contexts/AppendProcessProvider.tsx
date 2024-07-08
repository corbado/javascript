import type { CorbadoConnectAppendConfig } from '@corbado/types';
import type { FC, PropsWithChildren } from 'react';
import React, { useCallback, useMemo, useState } from 'react';

import type { AppendScreenType } from '../types/screenTypes';
import type { AppendProcessContextProps } from './AppendProcessContext';
import AppendProcessContext from './AppendProcessContext';

type Props = {
  config: CorbadoConnectAppendConfig;
  initialScreenType: AppendScreenType;
};

export const AppendProcessProvider: FC<PropsWithChildren<Props>> = ({ children, initialScreenType, config }) => {
  const [currentScreenType, setCurrentScreenType] = useState<AppendScreenType>(initialScreenType);

  const navigateToScreen = useCallback((screenType: AppendScreenType) => {
    setCurrentScreenType(screenType);
  }, []);

  const contextValue = useMemo<AppendProcessContextProps>(
    () => ({
      currentScreenType,
      navigateToScreen,
      config,
    }),
    [currentScreenType, navigateToScreen, config],
  );

  return <AppendProcessContext.Provider value={contextValue}>{children}</AppendProcessContext.Provider>;
};

export default AppendProcessProvider;