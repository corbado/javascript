import React, { useMemo } from 'react';

import useAppendProcess from '../hooks/useAppendProcess';
import { AppendScreenType } from '../types/screenTypes';
import AppendInitScreen from './append/AppendInitScreen';
import AppendSuccessScreen from './append/AppendSuccessScreen';

const CorbadoConnectAppendContainer = () => {
  const { currentScreenType } = useAppendProcess();

  const currentScreenComponent = useMemo(() => {
    switch (currentScreenType) {
      case AppendScreenType.Init:
        return <AppendInitScreen />;
      case AppendScreenType.Success:
        return <AppendSuccessScreen />;
    }
  }, [currentScreenType]);

  return <>{currentScreenComponent}</>;
};

export default CorbadoConnectAppendContainer;
