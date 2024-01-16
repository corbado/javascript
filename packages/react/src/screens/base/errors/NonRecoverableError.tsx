import type { NonRecoverableError as ErrorType } from '@corbado/web-core';
import type { FC } from 'react';
import React from 'react';

import { PrimaryButton } from '../../../components';

const NonRecoverableError: FC<{ error: ErrorType }> = ({ error }: { error: ErrorType }) => {
  return (
    <div className='container'>
      <div className='title'>
        {error.name} <br />({error.type === 'client' ? 'client side' : 'server side'})
      </div>
      <div className='error-details'>
        <div className='error-detail-row'>
          <div className='error-detail-title'>:Message</div>
          <div className='error-detail-value'>{error.message}</div>
        </div>
        <div className='error-detail-row'>
          <div className='error-detail-title'>:Type</div>
          <div className='error-detail-value'>{error.detailedType}</div>
        </div>
        <div className='error-detail-row'>
          <div className='error-detail-title'>:Link</div>
          <a
            className='error-detail-value'
            href={error.link}
          >
            {error.link}
          </a>
        </div>
      </div>
      <div className='error-detail-row'>
        <div className='error-detail-title'>:RequestID</div>
        <div className='error-detail-value'>{error.requestId}</div>
      </div>
      {error.details && (
        <PrimaryButton
          className='error-button'
          onClick={() => {
            window.open(error.details, '_blank');
          }}
        >
          See browser console for more details
        </PrimaryButton>
      )}
    </div>
  );
};

export default NonRecoverableError;
