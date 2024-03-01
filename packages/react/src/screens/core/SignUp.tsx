import { AuthType } from '@corbado/shared-ui';
import type { CorbadoSignUpConfig } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';

import { AuthFlow, FreemiumBadge } from '../../components';
import FlowHandlerProvider from '../../contexts/FlowHandlerProvider';

const SignUp: FC<CorbadoSignUpConfig> = ({ onSignedUp, navigateToLogin }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div>
        <FlowHandlerProvider
          onLoggedIn={onSignedUp}
          onChangeFlow={navigateToLogin}
          initialFlowType={AuthType.SignUp}
        >
          <AuthFlow />
        </FlowHandlerProvider>
      </div>
      <FreemiumBadge />
    </div>
  );
};

export default SignUp;
