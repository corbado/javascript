import type { CorbadoSignUpConfig } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';

import { AuthFlow } from '../../components';
import FlowHandlerProvider from '../../contexts/FlowHandlerProvider';
import { AuthType } from '../../shared-ui';

const SignUp: FC<CorbadoSignUpConfig> = ({
  handleNavigationEvents,
  onSignedUp,
  navigateToLogin,
  initialAutoFocus = true,
}) => {
  return (
    <FlowHandlerProvider
      handleNavigationEvents={handleNavigationEvents}
      onLoggedIn={onSignedUp}
      onChangeFlow={navigateToLogin}
      initialFlowType={AuthType.SignUp}
    >
      <AuthFlow initialAutoFocus={initialAutoFocus} />
    </FlowHandlerProvider>
  );
};

export default SignUp;
