import type { CorbadoConnectPasskeyListConfig } from '@corbado/types';
import type { FC, PropsWithChildren } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
import type { ManageScreenType } from '../types/screenTypes';
import ManageProcessContext, { ManageProcessContextProps } from './ManageProcessContext';

type Props = {
  config: CorbadoConnectPasskeyListConfig;
  initialScreenType: ManageScreenType;
};

export const ManageProcessProvider: FC<PropsWithChildren<Props>> = ({ children, initialScreenType, config }) => {
  const [currentScreenType, setCurrentScreenType] = useState<ManageScreenType>(initialScreenType);
  const [passkeyListToken, setPasskeyListToken] = useState<string>('');

  const navigateToScreen = useCallback((screenType: ManageScreenType) => {
    setCurrentScreenType(screenType);
  }, []);

  const contextValue = useMemo<ManageProcessContextProps>(
    () => ({
      currentScreenType,
      navigateToScreen,
      passkeyListToken,
      setPasskeyListToken,
      config,
    }),
    [currentScreenType, navigateToScreen, config, setPasskeyListToken, passkeyListToken],
  );

  return <ManageProcessContext.Provider value={contextValue}>{children}</ManageProcessContext.Provider>;
};

export default ManageProcessProvider;
