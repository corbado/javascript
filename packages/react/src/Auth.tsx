import './i18n';
import './styles.css';

import { CorbadoProvider, useCorbadoFlowHandler } from "@corbado/react-sdk";
import type { FC } from 'react';
import React from 'react';

import { flows } from './flows';

type Page = 'login' | 'register';

interface Props {
    projectId: string;
    page?: Page;
}

export const CorbadoAuth: FC<Props> = ({ projectId }) => {

    const { currentFlowName, currentScreenName } = useCorbadoFlowHandler();

    return (
        <div id="corbado-auth">
            <div className="container">
                <CorbadoProvider
                    projectId={projectId}
                >
                    {flows[currentFlowName][currentScreenName]}
                </CorbadoProvider>
            </div>
        </div>
    );
}
