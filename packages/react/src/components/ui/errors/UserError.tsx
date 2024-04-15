import React from 'react';
import { useTranslation } from 'react-i18next';

import { ExclamationIcon } from '../icons/ExclamationIcon';

type Props = {
  customerSupportEmail?: string;
  error: string;
};
export const UserError = ({ error, customerSupportEmail }: Props) => {
  const { t } = useTranslation('translation', { keyPrefix: 'errors' });

  return (
    <div className='cb-error-popup'>
      <div className='cb-error-popup-icon'>
        <ExclamationIcon className='cb-error-popup-icon' />
      </div>
      <div>
        <p className='cb-error-popup-text'>
          {error
            ? error
            : customerSupportEmail
              ? t('unexpectedError.withCustomerSupport', customerSupportEmail)
              : t('unexpectedError.noCustomerSupport')}
        </p>
      </div>
    </div>
  );
};
