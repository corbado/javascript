import './i18n';
import './styles.css';

import React from 'react';

import {ScreensFlow} from './screens/ScreenFlow';
import FlowHandlerProvider from "./hooks/FlowHandlerProvider";
import UserDataProvider from "./hooks/UserDataProvider";
import {FlowType} from "@corbado/web-core";

interface Props {
  onLoggedIn: () => void
}

const CorbadoAuthUI = ({onLoggedIn}: Props) => {
  return (
    <div id="corbado-auth">
      <div className="container">
        <FlowHandlerProvider onLoggedIn={onLoggedIn} initialFlowType={FlowType.SignUp}>
          <UserDataProvider>
            <ScreensFlow/>
          </UserDataProvider>
        </FlowHandlerProvider>
      </div>
    </div>
  );
}

export default CorbadoAuthUI
