import type { CorbadoConnectLoginSecondFactorConfig } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';

import LoginSecondFactorProcessProvider from '../contexts/LoginSecondFactorProcessProvider';
import { LoginSecondFactorScreenType } from '../types/screenTypes';
import CorbadoConnectLoginSecondFactorContainer from './login-second-factor/CorbadoConnectLoginSecondFactorContainer';

const CorbadoConnectLoginSecondFactor: FC<CorbadoConnectLoginSecondFactorConfig> = (
  config: CorbadoConnectLoginSecondFactorConfig,
) => {
  return (
    <div className='cb-connect light'>
      <div className='cb-connect-container cb-connect-login'>
        <LoginSecondFactorProcessProvider
          config={config}
          initialScreenType={LoginSecondFactorScreenType.Init}
        >
          <CorbadoConnectLoginSecondFactorContainer />
        </LoginSecondFactorProcessProvider>
      </div>
    </div>
  );
};

export default CorbadoConnectLoginSecondFactor;
