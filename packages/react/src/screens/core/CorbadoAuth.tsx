import type { BlockTypes } from '@corbado/shared-ui';
import type { CorbadoAuthConfig } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';

import { AuthFlow } from '../../components';
import FlowHandlerProvider from '../../contexts/FlowHandlerProvider';

const CorbadoAuth: FC<CorbadoAuthConfig> = ({ onLoggedIn, handleNavigationEvents, initialBlock }) => {
  return (
    <FlowHandlerProvider
      onLoggedIn={onLoggedIn}
      handleNavigationEvents={handleNavigationEvents}
      initialBlock={initialBlock as BlockTypes}
    >
      <AuthFlow />
    </FlowHandlerProvider>
  );
};

export default CorbadoAuth;
