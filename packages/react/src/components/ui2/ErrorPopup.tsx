import React from 'react';

import { ExlamationIcon } from '../ui/icons/Icons';

const ErrorPopup = () => (
  <div className='cb-error-popup-2'>
    <div className='cb-error-popup-icon-2'>
      <ExlamationIcon className='cb-error-popup-icon-2' />
    </div>
    <div>
      <p className='cb-error-popup-text-2'>
        Unable to complete action at this time. If the problem persists please contact support.
      </p>
    </div>
  </div>
);

export default ErrorPopup;
