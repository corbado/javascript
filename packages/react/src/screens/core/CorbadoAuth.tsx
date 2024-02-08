import type { CorbadoAuthConfig } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';

import { AuthFlow, FreemiumBadge } from '../../components';
import FlowHandlerProvider from '../../contexts/FlowHandlerProvider';

const CorbadoAuth: FC<CorbadoAuthConfig> = ({ onLoggedIn }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div className='cb-container'>
        <FlowHandlerProvider onLoggedIn={onLoggedIn}>
          <AuthFlow />
        </FlowHandlerProvider>
      </div>
      <FreemiumBadge />
    </div>
  );
};

export default CorbadoAuth;
