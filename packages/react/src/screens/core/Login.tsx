import type { CorbadoLoginConfig } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';

import { AuthFlow } from '../../components';
import FlowHandlerProvider from '../../contexts/FlowHandlerProvider';
import { AuthType } from '../../shared-ui';

const Login: FC<CorbadoLoginConfig> = ({
  handleNavigationEvents,
  onLoggedIn,
  navigateToSignUp,
  initialAutoFocus = true,
}) => {
  return (
    <FlowHandlerProvider
      handleNavigationEvents={handleNavigationEvents}
      onLoggedIn={onLoggedIn}
      onChangeFlow={navigateToSignUp}
      initialFlowType={AuthType.Login}
    >
      <AuthFlow initialAutoFocus={initialAutoFocus} />
    </FlowHandlerProvider>
  );
};

export default Login;
