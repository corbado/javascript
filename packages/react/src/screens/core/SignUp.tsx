import { AuthType } from '@corbado/shared-ui';
import type { CorbadoSignUpConfig } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';

import { AuthFlow } from '../../components';
import FlowHandlerProvider from '../../contexts/FlowHandlerProvider';

const SignUp: FC<CorbadoSignUpConfig> = ({ handleNavigationEvents, onSignedUp, navigateToLogin }) => {
  return (
    <FlowHandlerProvider
      handleNavigationEvents={handleNavigationEvents}
      onLoggedIn={onSignedUp}
      onChangeFlow={navigateToLogin}
      initialFlowType={AuthType.SignUp}
    >
      <AuthFlow />
    </FlowHandlerProvider>
  );
};

export default SignUp;
