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
  const [currentScreenOptions, setCurrentScreenOptions] = useState<any>();

  const navigateToScreen = useCallback((screenType: AppendScreenType, options?: any) => {
    setCurrentScreenType(screenType);
    setCurrentScreenOptions(options);
  }, []);

  const contextValue = useMemo<AppendProcessContextProps>(
    () => ({
      currentScreenType,
      currentScreenOptions,
      navigateToScreen,
      config,
    }),
    [currentScreenType, navigateToScreen, config],
  );

  return <AppendProcessContext.Provider value={contextValue}>{children}</AppendProcessContext.Provider>;
};

export default AppendProcessProvider;
