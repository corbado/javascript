import { AuthType } from '@corbado/shared-ui';
import type { CorbadoSignUpConfig } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';

import { AuthFlow } from '../../components';
import { FreemiumBadge } from '../../components/ui2/FreemiumBadge';
import FlowHandlerProvider from '../../contexts/FlowHandlerProvider';

const SignUp: FC<CorbadoSignUpConfig> = ({ onSignedUp, navigateToLogin }) => {
  return (
    <FlowHandlerProvider
      onLoggedIn={onSignedUp}
      onChangeFlow={navigateToLogin}
      initialFlowType={AuthType.SignUp}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div className='cb-container'>
          <AuthFlow />
        </div>
        <FreemiumBadge />
      </div>
    </FlowHandlerProvider>
  );
};

export default SignUp;
