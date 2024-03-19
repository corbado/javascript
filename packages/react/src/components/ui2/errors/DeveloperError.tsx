import type { CorbadoError } from '@corbado/web-core';
import React from 'react';

import { ExclamationIcon } from '../icons/ExclamationIcon';

type Props = {
  error: CorbadoError;
};

export const DeveloperError = ({ error }: Props) => {
  return (
    <div className='cb-error-popup'>
      <div className='cb-error-popup-icon'>
        <ExclamationIcon className='cb-error-popup-icon' />
      </div>
      <div>
        <p className='cb-error-popup-text'>{error.message}</p>
      </div>
    </div>
  );
};
