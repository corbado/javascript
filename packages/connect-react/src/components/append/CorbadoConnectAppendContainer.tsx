import React, { useMemo } from 'react';

import useAppendProcess from '../../hooks/useAppendProcess';
import { AppendScreenType } from '../../types/screenTypes';
import AppendAfterErrorScreen from './AppendAfterErrorScreen';
import AppendInitScreen from './AppendInitScreen';
import AppendSuccessScreen from './AppendSuccessScreen';

const CorbadoConnectAppendContainer = () => {
  const { currentScreenType, currentScreenOptions } = useAppendProcess();

  const currentScreenComponent = useMemo(() => {
    switch (currentScreenType) {
      case AppendScreenType.Init:
        return <AppendInitScreen />;
      case AppendScreenType.AfterHybridLogin:
        return <AppendAfterErrorScreen {...currentScreenOptions} />;
      case AppendScreenType.AfterError:
        return <AppendAfterErrorScreen {...currentScreenOptions} />;
      case AppendScreenType.Success:
        return <AppendSuccessScreen {...currentScreenOptions} />;
    }
  }, [currentScreenType]);

  return <>{currentScreenComponent}</>;
};

export default CorbadoConnectAppendContainer;
