import React, { useMemo } from 'react';

import useLoginProcess from '../hooks/useLoginProcess';
import { LoginScreenType } from '../types/screenTypes';
import LoginBenefitsScreen from './login/LoginBenetifsScreen';
import LoginErrorScreenHard from './login/LoginErrorScreenHard';
import LoginErrorScreenSoft from './login/LoginErrorScreenSoft';
import LoginInitScreen from './login/LoginInitScreen';
import { LoginPasskeyScreen } from './login/LoginPasskeyScreen';
import { LoadingSpinner } from './shared/LoadingSpinner';

const CorbadoConnectLoginContainer = () => {
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
      case LoginScreenType.Passkey:
        return <LoginPasskeyScreen />;
      case LoginScreenType.Invisible:
        return <></>;
    }
  }, [currentScreenType]);

  return <>{currentScreenComponent}</>;
};

export default CorbadoConnectLoginContainer;
