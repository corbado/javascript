import type { CorbadoAuthConfig } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';

import { AuthFlow } from '../../components';
import { FreemiumBadge } from '../../components/ui2/FreemiumBadge';
import FlowHandlerProvider from '../../contexts/FlowHandlerProvider';

const CorbadoAuth: FC<CorbadoAuthConfig> = ({ onLoggedIn }) => {
  return (
    <FlowHandlerProvider onLoggedIn={onLoggedIn}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div className='cb-container-2'>
          <AuthFlow />
        </div>
        <FreemiumBadge />
      </div>
    </FlowHandlerProvider>
  );
};

export default CorbadoAuth;
