import type { FC } from 'react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { PrimaryButton } from '../buttons/PrimaryButton';
import { Header } from '../typography/Header';
import { Text } from '../typography/Text';

export const ComponentUnavailableError: FC<{ customerSupportEmail?: string }> = ({ customerSupportEmail }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'errors.componentUnavailable' });

  return (
    <div className='cb-error-page'>
      <Header size='lg'>{t('header')}</Header>
      <div className='cb-error-page-body'>
        <div>
          <Text
            level='2'
            fontFamilyVariant='secondary'
          >
            {t('subheader')}
          </Text>
        </div>
        <div>
          <Text
            level='2'
            fontFamilyVariant='secondary'
          >
            {customerSupportEmail ? (
              <Trans
                i18nKey='body_withCustomerSupport'
                t={t}
                values={{
                  customerSupportEmail: customerSupportEmail,
                }}
              />
            ) : (
              t('body_noCustomerSupport')
            )}
          </Text>
        </div>
      </div>
      <PrimaryButton onClick={() => window.location.reload()}>{t('button')}</PrimaryButton>
    </div>
  );
};
