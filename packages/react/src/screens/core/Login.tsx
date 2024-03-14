import { AuthType } from '@corbado/shared-ui';
import type { CorbadoLoginConfig } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';

import { AuthFlow } from '../../components';
import { FreemiumBadge } from '../../components/ui2/FreemiumBadge';
import FlowHandlerProvider from '../../contexts/FlowHandlerProvider';

const Login: FC<CorbadoLoginConfig> = ({ onLoggedIn, navigateToSignUp }) => {
  return (
    <FlowHandlerProvider
      onLoggedIn={onLoggedIn}
      onChangeFlow={navigateToSignUp}
      initialFlowType={AuthType.Login}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div className='cb-container-2'>
          <AuthFlow />
        </div>
        <FreemiumBadge />
      </div>
    </FlowHandlerProvider>
  );
};

export default Login;
