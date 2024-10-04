import type { CorbadoConnectLoginConfig } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';

import LoginProcessProvider from '../contexts/LoginProcessProvider';
import { LoginScreenType } from '../types/screenTypes';
import CorbadoConnectLoginContainer from './login/CorbadoConnectLoginContainer';

const CorbadoConnectLogin: FC<CorbadoConnectLoginConfig> = (config: CorbadoConnectLoginConfig) => {
  return (
    <div className='cb-connect-container cb-connect-login'>
      <LoginProcessProvider
        config={config}
        initialScreenType={LoginScreenType.Init}
      >
        <CorbadoConnectLoginContainer />
      </LoginProcessProvider>
    </div>
  );
};

export default CorbadoConnectLogin;
