import React from 'react';
import { useTranslation } from 'react-i18next';

import { PrimaryButton } from '../../ui';

export const ComponentUnavailableError = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'errors.componentUnavailable' });

  return (
    <div className='error-page'>
      <div className='prod-error-container'>
        <div className='prod-error-title'>{t('header')}</div>
        <div className='prod-error-details'>
          <div className='prod-error-apology'>{t('subheader')}</div>
        </div>
        <PrimaryButton onClick={() => window.location.reload()}>{t('button')}</PrimaryButton>
      </div>
    </div>
  );
};
