import React, { useMemo } from 'react';

import useLoginProcess from '../hooks/useLoginProcess';
import { LoginScreenType } from '../types/screenTypes';
import LoginBenefitsScreen from './login/LoginBenetifsScreen';
import LoginErrorScreenHard from './login/LoginErrorScreenHard';
import LoginErrorScreenSoft from './login/LoginErrorScreenSoft';
import LoginInitScreen from './login/LoginInitScreen';
import { LoginPasskeyReLoginScreen } from './login/LoginPasskeyReLoginScreen';
import { LoadingSpinner } from './shared/LoadingSpinner';
import LoginSuccess from './login/LoginSuccess';

const CorbadoConnectLoginContainer = () => {
  const { currentScreenType } = useLoginProcess();

  const currentScreenComponent = useMemo(() => {
    switch (currentScreenType) {
      case LoginScreenType.Loading:
        return <LoadingSpinner />;
      case LoginScreenType.Init:
        return <LoginInitScreen />;
      case LoginScreenType.Success:
        return <LoginSuccess />;
      case LoginScreenType.Benefits:
        return <LoginBenefitsScreen />;
      case LoginScreenType.ErrorSoft:
        return <LoginErrorScreenSoft />;
      case LoginScreenType.ErrorHard:
        return <LoginErrorScreenHard />;
      case LoginScreenType.PasskeyReLogin:
        return <LoginPasskeyReLoginScreen />;
      case LoginScreenType.Invisible:
        return <></>;
    }
  }, [currentScreenType]);

  return <>{currentScreenComponent}</>;
};

export default CorbadoConnectLoginContainer;
