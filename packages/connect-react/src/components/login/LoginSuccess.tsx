import React from 'react';

import { PasskeyIcon } from '../shared/icons/PasskeyIcon';
import { SuccessIcon } from '../shared/icons/SuccessIcon';

const LoginSuccess = () => {
  return (
    <>
      <div className='cb-h2'>Your passkey log in was successful !</div>
      <div className='cb-login-success-icons'>
        <PasskeyIcon />
        <SuccessIcon className='cb-login-success-icons-success' />
      </div>
      <div className='cb-p'>You’re all set, please wait a moment whilst we log you in to your myVicRoads account.</div>
    </>
  );
};

export default LoginSuccess;
