import './i18n';
import './styles.css';

import { CorbadoProvider, type ICorbadoContextParams } from "@corbado/react-sdk";
import React from 'react';

import { ScreensFlow } from './screens/ScreenFlow';

type Props = ICorbadoContextParams;

export const CorbadoAuth: React.FC<Props> = ({ projectId }) => {
    return (
        <div id="corbado-auth">
            <div className="container">
                <CorbadoProvider
                    projectId={projectId}
                >
                    <ScreensFlow />
                </CorbadoProvider>
            </div>
        </div>
    );
}
