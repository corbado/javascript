import type { CorbadoError } from '@corbado/web-core';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { ExclamationIcon } from '../icons/ExclamationIcon';

type Props = {
  customerSupportEmail?: string;
  error: CorbadoError;
};
export const UserError = ({ customerSupportEmail, error }: Props) => {
  // by default, we show a generic error message with a customer support email
  const { t } = useTranslation('translation', { keyPrefix: 'errors.unexpectedError' });
  let errorString = customerSupportEmail ? t('withCustomerSupport', customerSupportEmail) : t('noCustomerSupport');

  // if we have more information though, we show a more detailed error (sometimes we show custom error messages at the top, e.g. for social logins)
  if (error.translatedMessage.length > 0) {
    errorString = error.translatedMessage;
  }

  return (
    <div className='cb-error-popup'>
      <div className='cb-error-popup-icon'>
        <ExclamationIcon className='cb-error-popup-icon' />
      </div>
      <div>
        <p className='cb-error-popup-text'>{errorString}</p>
      </div>
    </div>
  );
};
