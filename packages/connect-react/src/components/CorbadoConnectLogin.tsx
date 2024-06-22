import type { CorbadoConnectLoginConfig } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';

import LoginProcessProvider from '../contexts/LoginProcessProvider';
import { LoginScreenType } from '../types/ScreenType';
import CorbadoConnectLoginContainer from './CorbadoConnectLoginContainer';

const CorbadoConnectLogin: FC<CorbadoConnectLoginConfig> = (config: CorbadoConnectLoginConfig) => {
  return (
    <div className='light'>
      <div className='cb-connect-container'>
        <LoginProcessProvider
          config={config}
          initialScreenType={LoginScreenType.Init}
        >
          <CorbadoConnectLoginContainer />
        </LoginProcessProvider>
      </div>
    </div>
  );
};

export default CorbadoConnectLogin;
