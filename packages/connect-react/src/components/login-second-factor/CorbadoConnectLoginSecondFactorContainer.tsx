import React, { useMemo } from 'react';
import { LoginSecondFactorScreenType } from '../../types/screenTypes';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import useLoginSecondFactorProcess from '../../hooks/useLoginSecondFactorProcess';
import InitScreen from './InitScreen';

const CorbadoConnectLoginSecondFactorContainer = () => {
  const { currentScreenType, currentScreenOptions } = useLoginSecondFactorProcess();

  const currentScreenComponent = useMemo(() => {
    console.log('currentScreenType', currentScreenType);
    switch (currentScreenType) {
      case LoginSecondFactorScreenType.Loading:
        return <LoadingSpinner />;
      case LoginSecondFactorScreenType.Init:
        return <InitScreen {...currentScreenOptions} />;
      case LoginSecondFactorScreenType.ErrorHard:
        return <></>;
    }
  }, [currentScreenType]);

  return <>{currentScreenComponent}</>;
};

export default CorbadoConnectLoginSecondFactorContainer;
