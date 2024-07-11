import React, { useMemo } from 'react';

import useManageProcess from '../hooks/useManageProcess';
import { ManageScreenType } from '../types/screenTypes';
import PasskeyListScreen from './passkeyList/PasskeyListScreen';

const CorbadoConnectPasskeyListContainer = () => {
  const { currentScreenType } = useManageProcess();

  const currentScreenComponent = useMemo(() => {
    switch (currentScreenType) {
      case ManageScreenType.Init:
        return <PasskeyListScreen />;
      case ManageScreenType.Invisible:
        return <></>;
    }
  }, [currentScreenType]);

  return <>{currentScreenComponent}</>;
};

export default CorbadoConnectPasskeyListContainer;
