import { FlowType } from '@corbado/shared-ui';
import type { CorbadoAuthConfig } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';

import { AuthFlow } from '../components/wrappers/AuthFlow';
import FlowHandlerProvider from '../contexts/FlowHandlerProvider';
import UserDataProvider from '../contexts/UserDataProvider';
import CorbadoScreen from '../hocs/CorbadoScreen';

const CorbadoAuth: FC<CorbadoAuthConfig> = ({ onLoggedIn }) => {
  return (
    <CorbadoScreen>
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
    </CorbadoScreen>
  );
};

export default CorbadoAuth;
