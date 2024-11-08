import React from 'react';

import { LoadingSpinner } from '../../shared/LoadingSpinner';

const AppendInitLoading = () => {
  return (
    <div className='cb-passkey-list-loader-container'>
      <LoadingSpinner className='cb-passkey-list-loader' />
    </div>
  );
};

export default AppendInitLoading;
