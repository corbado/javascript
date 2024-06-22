import type { CorbadoConnectAppendConfig } from '@corbado/types';
import type { FC } from 'react';
import React, { useMemo } from 'react';

import useAppendProcess from '../hooks/useAppendProcess';
import { AppendScreenType } from '../types/ScreenType';
import AppendBenefitsScreen from './append/AppendBenetifsScreen';
import AppendInitScreen from './append/AppendInitScreen';
import withTheme from './hoc/withTheme';
import AppendSuccessScreen from './append/AppendSuccessScreen';

const CorbadoConnectAppendContainer: FC<CorbadoConnectAppendConfig> = () => {
  const { currentScreenType } = useAppendProcess();

  const currentScreenComponent = useMemo(() => {
    switch (currentScreenType) {
      case AppendScreenType.Init:
        return <AppendInitScreen />;
      case AppendScreenType.Benefits:
        return <AppendBenefitsScreen />;
      case AppendScreenType.Success:
        return <AppendSuccessScreen />;
      default:
        return null;
    }
  }, [currentScreenType]);

  return <div className='cb-connect-container'>{currentScreenComponent}</div>;
};

export default withTheme(CorbadoConnectAppendContainer);
