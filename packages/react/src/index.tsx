import './i18n';
import './styles.css';

import { CorbadoProvider } from "@corbado/react-sdk";
import type { FC } from 'react';
import React from 'react';

import { ScreensFlow } from './screens/ScreenFlow';

interface Props {
    projectId: string;
}

export const CorbadoAuth: FC<Props> = ({ projectId }) => {
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
