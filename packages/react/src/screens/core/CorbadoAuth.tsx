import type { CorbadoAuthConfig } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';

import { AuthFlow } from '../../components/authentication/AuthFlow';
import FlowHandlerProvider from '../../contexts/FlowHandlerProvider';

const CorbadoAuth: FC<CorbadoAuthConfig> = ({ onLoggedIn, isDevMode = false, customerSupportEmail = '' }) => {
  return (
    <div className='cb-container'>
      <FlowHandlerProvider onLoggedIn={onLoggedIn}>
        <AuthFlow
          isDevMode={isDevMode}
          customerSupportEmail={customerSupportEmail}
        />
      </FlowHandlerProvider>
    </div>
  );
};

export default CorbadoAuth;
