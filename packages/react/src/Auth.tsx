import React from 'react';
import { InitiateSignup } from './screens/InitiateSignup'; 
import './i18n';
import './styles.css';

export const Auth = () => {
    return (
        <div id="corbado-auth" className='container'>
            <InitiateSignup />
        </div>
    );
}
