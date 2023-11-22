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
        <FlowHandlerProvider
          onLoggedIn={onLoggedIn}
          initialFlowType={FlowType.SignUp}
        >
          <UserDataProvider>
            <ScreensFlow />
          </UserDataProvider>
        </FlowHandlerProvider>
      </div>
    </div>
  );
};

export default CorbadoAuthUI;
