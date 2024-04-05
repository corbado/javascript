import { useCorbado } from '@corbado/react-sdk';
import type { CorbadoUser, Identifier } from '@corbado/types';
import type { FC } from 'react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { InputField, LoadingSpinner, PasskeyListErrorBoundary, PhoneInputField, Text } from '../../components';

interface ProcessedUser {
  name: string;
  username?: string;
  emails: Identifier[];
  phoneNumbers: Identifier[];
}

export const User: FC = () => {
  const { corbadoApp, isAuthenticated, globalError, getFullUser } = useCorbado();
  const { t } = useTranslation('translation', { keyPrefix: 'user' });
  const [currentUser, setCurrentUser] = useState<CorbadoUser | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    void getCurrentUser();
  }, [isAuthenticated]);

  const headerText = useMemo(() => t('header'), [t]);
  const nameFieldLabel = useMemo(() => t('name'), [t]);
  const usernameFieldLabel = useMemo(() => t('username'), [t]);
  const emailFieldLabel = useMemo(() => t('email'), [t]);
  const phoneFieldLabel = useMemo(() => t('phone'), [t]);
  const verifiedText = useMemo(() => t('verified'), [t]);
  const unverifiedText = useMemo(() => t('unverified'), [t]);
  const processUser = useMemo((): ProcessedUser => {
    if (!currentUser) {
      return {
        name: '',
        emails: [],
        phoneNumbers: [],
      };
    }

    return {
      name: currentUser.fullName,
      username: currentUser.identifiers.find(id => id.type === 'username')?.value,
      emails: currentUser.identifiers.filter(id => id.type === 'email'),
      phoneNumbers: currentUser.identifiers.filter(id => id.type === 'phone'),
    };
  }, [currentUser]);

  const getCurrentUser = useCallback(async () => {
    setLoading(true);
    const result = await getFullUser();

    if (!result || result?.err) {
      throw new Error(result?.val.name);
    }

    setCurrentUser(result.val);
    setLoading(false);
  }, [corbadoApp]);

  if (!isAuthenticated) {
    return <div>{t('warning_notLoggedIn')}</div>;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <PasskeyListErrorBoundary globalError={globalError}>
      <div className='cb-user-details-section'>
        <Text
          level='5'
          fontWeight='bold'
          className='cb-user-details-section-header'
        >
          {headerText}
        </Text>
        {processUser.name && (
          <InputField
            className='cb-user-details-section-indentifier'
            label={nameFieldLabel}
            value={processUser.name}
            disabled
          />
        )}
        {processUser.username && (
          <InputField
            className='cb-user-details-section-indentifier'
            label={usernameFieldLabel}
            value={processUser.username}
            disabled
          />
        )}
        <div className='cb-user-details-section-indentifiers-list'>
          {processUser.emails.map((email, i) => (
            <div className='cb-user-details-section-indentifiers-list-item'>
              <div className='cb-user-details-section-indentifiers-list-item-field'>
                <InputField
                  className='cb-user-details-section-indentifiers-list-item-field-input'
                  key={email.value}
                  label={i === 0 ? emailFieldLabel : undefined}
                  value={email.value}
                  disabled
                />
              </div>
              <div
                className={`cb-user-details-section-indentifiers-list-item-badge cb-user-details-section-indentifiers-list-item-badge-${email.status === 'verified' ? 'primary' : 'secondary'}`}
              >
                <Text
                  level='2'
                  fontFamilyVariant='secondary'
                  fontWeight='bold'
                  className='cb-user-details-section-indentifiers-list-item-badge-text'
                >
                  {email.status === 'verified' ? verifiedText : unverifiedText}
                </Text>
              </div>
            </div>
          ))}
        </div>
        <div className='cb-user-details-section-indentifiers-list'>
          {processUser.phoneNumbers.map((phone, i) => (
            <div className='cb-user-details-section-indentifiers-list-item'>
              <div className='cb-user-details-section-indentifiers-list-item-field'>
                <PhoneInputField
                  className='cb-user-details-section-indentifiers-list-item-field-input'
                  key={phone.value}
                  label={i === 0 ? phoneFieldLabel : undefined}
                  initialPhoneNumber={phone.value}
                  disabled
                />
              </div>
              <div
                className={`cb-user-details-section-indentifiers-list-item-badge cb-user-details-section-indentifiers-list-item-badge-${phone.status === 'verified' ? 'primary' : 'secondary'}`}
              >
                <Text
                  level='2'
                  fontFamilyVariant='secondary'
                  fontWeight='bold'
                  className='cb-user-details-section-indentifiers-list-item-badge-text'
                >
                  {phone.status === 'verified' ? verifiedText : unverifiedText}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PasskeyListErrorBoundary>
  );
};
