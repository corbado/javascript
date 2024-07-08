import React, { useMemo } from 'react';

import PasskeyListScreen from './passkeyList/PasskeyListScreen';
import useManageProcess from '../hooks/useManageProcess';
import { ManageScreenType } from '../types/screenTypes';

const CorbadoConnectPasskeyListContainer = () => {
  const { currentScreenType } = useManageProcess();

  const currentScreenComponent = useMemo(() => {
    switch (currentScreenType) {
      case ManageScreenType.Init:
        return <PasskeyListScreen />;
    }
  }, [currentScreenType]);

  return <>{currentScreenComponent}</>;
};

export default CorbadoConnectPasskeyListContainer;
