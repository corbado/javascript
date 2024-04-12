import React from 'react';
import { useTranslation } from 'react-i18next';

import { ExclamationIcon } from '../icons/ExclamationIcon';

type Props = {
  customerSupportEmail?: string;
};
export const UserError = ({ customerSupportEmail }: Props) => {
  const { t } = useTranslation('translation', { keyPrefix: 'errors.unexpectedError' });

  return (
    <div className='cb-error-popup'>
      <div className='cb-error-popup-icon'>
        <ExclamationIcon className='cb-error-popup-icon' />
      </div>
      <div>
        <p className='cb-error-popup-text'>
          {customerSupportEmail ? t('withCustomerSupport', customerSupportEmail) : t('noCustomerSupport')}
        </p>
      </div>
    </div>
  );
};