import type { FC } from 'react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useCorbado } from '../..';
import { LoadingSpinner, PasskeyListErrorBoundary, Text } from '../../components';
import { CorbadoUserDetailsProvider } from '../../contexts/CorbadoUserDetailsProvider';
import EmailsEdit from '../user-details-blocks/EmailsEdit';
import NameEdit from '../user-details-blocks/NameEdit';
import PhonesEdit from '../user-details-blocks/PhonesEdit';
import UserDelete from '../user-details-blocks/UserDelete';
import UsernameEdit from '../user-details-blocks/UsernameEdit';

export const UserDetails: FC = () => {
  const { globalError, isAuthenticated, loading } = useCorbado();
  const { t } = useTranslation('translation');

  const title = useMemo(() => t('user-details.title'), [t]);

  // const headerSocial = useMemo(() => t('user-details.social'), [t]);

  if (!isAuthenticated) {
    return <div>{t('user-details.warning_notLoggedIn')}</div>;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <CorbadoUserDetailsProvider>
      <PasskeyListErrorBoundary globalError={globalError}>
        <div className='cb-user-details-container'>
          <Text className='cb-user-details-title'>{title}</Text>
          <NameEdit />
          <UsernameEdit />
          <EmailsEdit />
          <PhonesEdit />

          {/* <div className='cb-user-details-section-indentifiers-list'>
          {processUser.socialAccounts.map((social, i) => (
            <div className='cb-user-details-card'>
              <div
                className='cb-user-details-section-indentifiers-list-item'
                key={`user-details-email-${social.providerType}`}
              >
                <div className='cb-user-details-section-indentifiers-list-item-field'>
                  <InputField
                    className='cb-user-details-section-indentifiers-list-item-field-input'
                    key={social.providerType}
                    label={i === 0 ? headerSocial : undefined}
                    value={`${social.fullName} - ${social.identifierValue}`}
                    disabled
                  />
                </div>
                <div className='cb-user-details-section-indentifiers-list-item-badge cb-user-details-section-indentifiers-list-item-badge-primary'>
                  <Text
                    level='2'
                    fontFamilyVariant='secondary'
                    fontWeight='bold'
                    className='cb-user-details-section-indentifiers-list-item-badge-text'
                  >
                    {t(`providers.${social.providerType}`) || social.providerType}
                  </Text>
                </div>
              </div>
            </div>
          ))}
        </div> */}

          <UserDelete />
        </div>
      </PasskeyListErrorBoundary>
    </CorbadoUserDetailsProvider>
  );
};

export default UserDetails;
