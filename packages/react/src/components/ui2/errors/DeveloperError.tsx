import type { CorbadoError } from '@corbado/web-core';
import React from 'react';

import { ExclamationIcon } from '../icons/ExclamationIcon';

type Props = {
  error: CorbadoError;
};

export const DeveloperError = ({ error }: Props) => {
  return (
    <div className='cb-error-popup-2'>
      <div className='cb-error-popup-icon-2'>
        <ExclamationIcon className='cb-error-popup-icon-2' />
      </div>
      <div>
        <p className='cb-error-popup-text-2'>{error.message}</p>
      </div>
    </div>
  );
};
