import './i18n';
import './styles.css';

import { FlowType } from '@corbado/web-core';
import React from 'react';

import FlowHandlerProvider from './contexts/FlowHandlerProvider';
import UserDataProvider from './contexts/UserDataProvider';
import { ScreensFlow } from './screens/ScreenFlow';

interface Props {
  onLoggedIn: () => void;
}

const CorbadoAuthUI = ({ onLoggedIn }: Props) => {
  return (
    <div id='corbado-auth'>
      <div className='container'>
        <UserDataProvider>
          <FlowHandlerProvider
            onLoggedIn={onLoggedIn}
            initialFlowType={FlowType.SignUp}
          >
            <ScreensFlow />
          </FlowHandlerProvider>
        </UserDataProvider>
      </div>
    </div>
  );
};

export default CorbadoAuthUI;
