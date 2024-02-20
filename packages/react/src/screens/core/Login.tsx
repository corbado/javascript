import { FlowType } from '@corbado/shared-ui';
import type { CorbadoLoginConfig } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';

import { AuthFlow, FreemiumBadge } from '../../components';
import FlowHandlerProvider from '../../contexts/FlowHandlerProvider';

const Login: FC<CorbadoLoginConfig> = ({ onLoggedIn, navigateToSignUp }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div className='cb-container'>
        <FlowHandlerProvider
          onLoggedIn={onLoggedIn}
          onChangeFlow={navigateToSignUp}
          initialFlowType={FlowType.Login}
        >
          <AuthFlow />
        </FlowHandlerProvider>
      </div>
      <FreemiumBadge />
    </div>
  );
};

export default Login;
