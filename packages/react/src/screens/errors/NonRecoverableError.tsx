import type { NonRecoverableError as ErrorType } from '@corbado/web-core';
import type { FC } from 'react';
import React from 'react';

const NonRecoverableError: FC<{ error: ErrorType }> = ({ error }: { error: ErrorType }) => {
  return (
    <div className='container'>
      <div className='title'>
        {error.name} ({error.type === 'client' ? 'client side' : 'server side'})
      </div>
      <div className='error-details'>
        <div className='error-detail-row'>
          <div className='error-detail-title'>Message:</div>
          <div className='error-detail-value'>{error.message}</div>
        </div>
        <div className='error-detail-row'>
          <div className='error-detail-title'>Link:</div>
          <div className='error-detail-value'>{error.link}</div>
        </div>
      </div>
    </div>
  );
};

export default NonRecoverableError;
