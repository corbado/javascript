import { FlowType } from '@corbado/shared-ui';
import type { CorbadoLoginConfig } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';

import { AuthFlow } from '../components/wrappers/AuthFlow';
import FlowHandlerProvider from '../contexts/FlowHandlerProvider';

const Login: FC<CorbadoLoginConfig> = ({
  onLoggedIn,
  isDevMode = false,
  customerSupportEmail = '',
  navigateToSignUp,
}) => {
  return (
    <div className='cb-container'>
      <FlowHandlerProvider
        onLoggedIn={onLoggedIn}
        navigateFromFlow={navigateToSignUp}
        initialFlowType={FlowType.Login}
      >
        <AuthFlow
          isDevMode={isDevMode}
          customerSupportEmail={customerSupportEmail}
        />
      </FlowHandlerProvider>
    </div>
  );
};

export default Login;
