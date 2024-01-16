import { FlowType } from '@corbado/shared-ui';
import type { CorbadoSignUpConfig } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';

import { AuthFlow } from '../../components/authentication/AuthFlow';
import FlowHandlerProvider from '../../contexts/FlowHandlerProvider';

const SignUp: FC<CorbadoSignUpConfig> = ({
  onSignedUp,
  isDevMode = false,
  customerSupportEmail = '',
  navigateToLogin,
}) => {
  return (
    <div className='cb-container'>
      <FlowHandlerProvider
        onLoggedIn={onSignedUp}
        onChangeFlow={navigateToLogin}
        initialFlowType={FlowType.SignUp}
      >
        <AuthFlow
          isDevMode={isDevMode}
          customerSupportEmail={customerSupportEmail}
        />
      </FlowHandlerProvider>
    </div>
  );
};

export default SignUp;
