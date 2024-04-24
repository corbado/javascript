import type { CorbadoError } from '@corbado/web-core';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { ExclamationIcon } from '../icons/ExclamationIcon';
import { Text } from '../typography';

type Props = {
  customerSupportEmail?: string;
  error: CorbadoError;
};
export const UserError = ({ customerSupportEmail, error }: Props) => {
  const { t } = useTranslation('translation', { keyPrefix: 'errors.unexpectedError' });
  let errorString = '';

  // if we have more information though, we show a more detailed error (sometimes we show custom error messages at the top, e.g. for social logins)
  if (error.translatedMessage.length > 0) {
    errorString = error.translatedMessage;
  } else {
    // by default, we show a generic error message with a customer support email
    errorString = customerSupportEmail ? t('withCustomerSupport', customerSupportEmail) : t('noCustomerSupport');
  }

  return (
    <div className='cb-error-popup'>
      <div className='cb-error-popup-icon'>
        <ExclamationIcon className='cb-error-popup-icon' />
      </div>
      <div className='cb-error-popup-text-container'>
        <Text
          level='2'
          fontFamilyVariant='secondary'
          className='cb-error-popup-text'
        >
          {errorString}
        </Text>
      </div>
    </div>
  );
};
