import React from 'react';

import { ExclamationIcon } from '../icons/ExclamationIcon';

const ErrorPopup = () => (
  <div className='cb-error-popup-2'>
    <div className='cb-error-popup-icon-2'>
      <ExclamationIcon className='cb-error-popup-icon-2' />
    </div>
    <div>
      <p className='cb-error-popup-text-2'>
        Unable to complete action at this time. If the problem persists please contact support.
      </p>
    </div>
  </div>
);

export default ErrorPopup;
