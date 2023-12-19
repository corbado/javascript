import React from 'react';
import { useTranslation } from 'react-i18next';

const NonRecoverableErrorForCustomer = (customerSupportEmail: { customerSupportEmail: string }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'authenticationFlows.unexpectedError' });
  return (
    <div className='error-page'>
      <div className='prod-error-container'>
        <div className='prod-error-title'>{t('header')}</div>
        <div className='prod-error-details'>
          <div className='prod-error-apology'>{t('body_introduction')}</div>
          <div>
            {customerSupportEmail
              ? t('body_explanationCustomerSupport', customerSupportEmail)
              : t('body_explanationNoCustomerSupport')}
          </div>
        </div>
        <button
          className='prod-error-button'
          onClick={() => window.location.reload()}
        >
          {t('cta')}
        </button>
      </div>
    </div>
  );
};

export default NonRecoverableErrorForCustomer;
