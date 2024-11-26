import React from 'react';

import { LoadingSpinner } from '../../shared/LoadingSpinner';

const LoginInitLoading = () => {
  return (
    <div className='cb-login-loader-container'>
      <LoadingSpinner className='cb-login-loader' />
    </div>
  );
};
export default LoginInitLoading;
