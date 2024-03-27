import { AuthType } from '@corbado/shared-ui';
import type { CorbadoSignUpConfig } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';

import { AuthFlow } from '../../components';
import FlowHandlerProvider from '../../contexts/FlowHandlerProvider';

const SignUp: FC<CorbadoSignUpConfig> = ({ onSignedUp, navigateToLogin }) => {
  return (
    <FlowHandlerProvider
      onLoggedIn={onSignedUp}
      onChangeFlow={navigateToLogin}
      initialFlowType={AuthType.SignUp}
    >
      <AuthFlow />
    </FlowHandlerProvider>
  );
};

export default SignUp;
