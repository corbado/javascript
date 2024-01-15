import React from 'react';
import { useTranslation } from 'react-i18next';

import { PrimaryButton } from '../../components';

const NonRecoverableErrorForCustomer = (customerSupportEmail: { customerSupportEmail: string }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'authenticationFlows.unexpectedError' });
  return (
    <div className='error-page'>
      <div className='prod-error-container'>
        <div className='prod-error-title'>{t('header')}</div>
        <div className='prod-error-details'>
          <div className='prod-error-apology'>{t('subheader')}</div>
          <div>
            {customerSupportEmail ? t('body_withCustomerSupport', customerSupportEmail) : t('body_noCustomerSupport')}
          </div>
        </div>
        <PrimaryButton onClick={() => window.location.reload()}>{t('button')}</PrimaryButton>
      </div>
    </div>
  );
};

export default NonRecoverableErrorForCustomer;
