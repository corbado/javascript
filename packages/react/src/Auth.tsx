import React from 'react';
import './i18n';
import './styles.css';
import { PasskeySignup } from './screens/PasskeySignup';
import { CreatePasskey } from './screens/CreatePasskey';
import { PasskeyCreationSuccess } from './screens/PasskeyCreationSuccess';
import { PasskeyCreationError } from './screens/PasskeyCreationError';
import { PasskeyLoginActivation } from './screens/PasskeyLoginActivation';

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
