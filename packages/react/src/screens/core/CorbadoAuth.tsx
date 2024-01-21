import type { CorbadoAuthConfig } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';

import { AuthFlow } from '../../components';
import FlowHandlerProvider from '../../contexts/FlowHandlerProvider';

const CorbadoAuth: FC<CorbadoAuthConfig> = ({ onLoggedIn }) => {
  return (
    <div className='cb-container'>
      <FlowHandlerProvider onLoggedIn={onLoggedIn}>
        <AuthFlow />
      </FlowHandlerProvider>
    </div>
  );
};

export default CorbadoAuth;
