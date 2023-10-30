import React from 'react';
import Signup from './screens/Signup'; 
import './i18n';
import './styles.css';

export const Auth = () => {
    return (
        <div id="corbado-auth" className='container'>
            <Signup />
        </div>
    );
}
