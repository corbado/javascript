import './i18n';
import './styles.css';

import React from 'react';

import { CreatePasskey } from './screens/CreatePasskey';
import { PasskeyCreationError } from './screens/PasskeyCreationError';
import { PasskeyCreationSuccess } from './screens/PasskeyCreationSuccess';
import { PasskeyLoginActivation } from './screens/PasskeyLoginActivation';
import { PasskeySignup } from './screens/PasskeySignup';

export const Auth = () => {
    return (
        <div id="corbado-auth">
            <div className="container">
                <PasskeySignup />
            </div>
            <div className="container">
                <CreatePasskey />
            </div>
            <div className="container">
                <PasskeyCreationSuccess />
            </div>
            <div className="container">
                <PasskeyCreationError />
            </div>
            <div className="container">
                <PasskeyLoginActivation />
            </div>
        </div>
    );
}
