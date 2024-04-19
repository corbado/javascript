import { AuthType } from '@corbado/shared-ui';
import type { CorbadoLoginConfig } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';

import { AuthFlow } from '../../components';
import FlowHandlerProvider from '../../contexts/FlowHandlerProvider';

const Login: FC<CorbadoLoginConfig> = ({ handleNavigationEvents, onLoggedIn, navigateToSignUp }) => {
  return (
    <FlowHandlerProvider
      handleNavigationEvents={handleNavigationEvents}
      onLoggedIn={onLoggedIn}
      onChangeFlow={navigateToSignUp}
      initialFlowType={AuthType.Login}
    >
      <AuthFlow />
    </FlowHandlerProvider>
  );
};

export default Login;
