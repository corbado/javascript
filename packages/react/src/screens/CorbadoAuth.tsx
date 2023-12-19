import { FlowType } from '@corbado/shared-ui';
import type { CorbadoAuthConfig } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';

import { AuthFlow } from '../components/wrappers/AuthFlow';
import FlowHandlerProvider from '../contexts/FlowHandlerProvider';
import UserDataProvider from '../contexts/UserDataProvider';

const CorbadoAuth: FC<CorbadoAuthConfig> = ({ onLoggedIn }) => {
  return (
    <div>
      <div className='cb-container'>
        <UserDataProvider>
          <FlowHandlerProvider
            onLoggedIn={onLoggedIn}
            initialFlowType={FlowType.SignUp}
          >
            <AuthFlow />
          </FlowHandlerProvider>
        </UserDataProvider>
      </div>
    </div>
  );
};

export default CorbadoAuth;
