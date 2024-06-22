import type { CorbadoConnectLoginConfig } from '@corbado/types';
import type { FC } from 'react';
import React, { useMemo } from 'react';

import useLoginProcess from '../hooks/useLoginProcess';
import { LoginScreenType } from '../types/ScreenType';
import withTheme from './hoc/withTheme';
import LoginBenefitsScreen from './login/LoginBenetifsScreen';
import LoginErrorScreenSoft from './login/LoginErrorScreenSoft';
import LoginInitScreen from './login/LoginInitScreen';
import { LoadingSpinner } from './shared/LoadingSpinner';
import LoginErrorScreenHard from './login/LoginErrorScreenHard';

const CorbadoConnectLoginContainer: FC<CorbadoConnectLoginConfig> = () => {
  const { currentScreenType } = useLoginProcess();

  const currentScreenComponent = useMemo(() => {
    switch (currentScreenType) {
      case LoginScreenType.Loading:
        return <LoadingSpinner />;
      case LoginScreenType.Init:
        return <LoginInitScreen />;
      case LoginScreenType.Benefits:
        return <LoginBenefitsScreen />;
      case LoginScreenType.ErrorSoft:
        return <LoginErrorScreenSoft />;
      case LoginScreenType.ErrorHard:
        return <LoginErrorScreenHard />;
      case LoginScreenType.Invisible:
        return <></>;
    }
  }, [currentScreenType]);

  return <div className='cb-connect-container'>{currentScreenComponent}</div>;
};

export default withTheme(CorbadoConnectLoginContainer);
