import './i18n';
import './styles.css';

import React from 'react';

import {ScreensFlow} from './screens/ScreenFlow';
import FlowHandlerProvider from "./hooks/FlowHandlerProvider";
import UserDataProvider from "./hooks/UserDataProvider";

interface Props {
    projectId: string
}

const CorbadoAuthUI = ({projectId}: Props) => {
    return (
        <div id="corbado-auth">
            <div className="container">
                <FlowHandlerProvider projectId={projectId}>
                    <UserDataProvider>
                        <ScreensFlow/>
                    </UserDataProvider>
                </FlowHandlerProvider>
            </div>
        </div>
    );
}

export default CorbadoAuthUI
