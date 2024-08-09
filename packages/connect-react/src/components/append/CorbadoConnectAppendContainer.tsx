import React, { useMemo } from 'react';

import useAppendProcess from '../../hooks/useAppendProcess';
import { AppendScreenType } from '../../types/screenTypes';
import AppendInitScreen from './AppendInitScreen';
import AppendSuccessScreen from './AppendSuccessScreen';
import AppendAfterHybridLoginScreen from './AppendAfterHybridLoginScreen';
import AppendAfterErrorScreen from './AppendAfterErrorScreen';

const CorbadoConnectAppendContainer = () => {
  const { currentScreenType, currentScreenOptions } = useAppendProcess();

  const currentScreenComponent = useMemo(() => {
    switch (currentScreenType) {
      case AppendScreenType.Init:
        return <AppendInitScreen />;
      case AppendScreenType.AfterHybridLogin:
        return <AppendAfterHybridLoginScreen {...currentScreenOptions} />;
      case AppendScreenType.AfterError:
        return <AppendAfterErrorScreen {...currentScreenOptions} />;
      case AppendScreenType.Success:
        return <AppendSuccessScreen />;
    }
  }, [currentScreenType]);

  return <>{currentScreenComponent}</>;
};

export default CorbadoConnectAppendContainer;
