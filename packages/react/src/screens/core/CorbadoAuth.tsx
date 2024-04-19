import type { CorbadoAuthConfig } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';

import { AuthFlow } from '../../components';
import FlowHandlerProvider from '../../contexts/FlowHandlerProvider';

const CorbadoAuth: FC<CorbadoAuthConfig> = ({ onLoggedIn, handleNavigationEvents }) => {
  return (
    <FlowHandlerProvider
      onLoggedIn={onLoggedIn}
      handleNavigationEvents={handleNavigationEvents}
    >
      <AuthFlow />
    </FlowHandlerProvider>
  );
};

export default CorbadoAuth;
