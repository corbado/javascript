import { LoginIdentifierType, type CorbadoUser, type Identifier, type SocialAccount } from '@corbado/types';
import type { FC } from 'react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, InputField, LoadingSpinner, PasskeyListErrorBoundary, PhoneInputField, Text } from '../../components';
import { ChangeIcon } from '../../components/ui/icons/ChangeIcon';
import { CopyIcon } from '../../components/ui/icons/CopyIcon';
import { useCorbado } from '../../hooks/useCorbado';

interface ProcessedUser {
  name: string;
  username?: string;
  emails: Identifier[];
  phoneNumbers: Identifier[];
  socialAccounts: SocialAccount[];
}

export const User: FC = () => {
  const { corbadoApp, isAuthenticated, globalError, getFullUser, updateName, updateUsername } = useCorbado();
  const { t } = useTranslation('translation', { keyPrefix: 'user' });
  const [currentUser, setCurrentUser] = useState<CorbadoUser | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [editingName, setEditingName] = useState<boolean>(false);
  const [editingUsername, setEditingUsername] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  
  let usernameIdentifierID = "";

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const abortController = new AbortController();
    void getCurrentUser(abortController);

    return () => {
      abortController.abort();
    };
  }, [isAuthenticated]);

  const nameFieldLabel = useMemo(() => t('name'), [t]);
  const usernameFieldLabel = useMemo(() => t('username'), [t]);
  const emailFieldLabel = useMemo(() => t('email'), [t]);
  const phoneFieldLabel = useMemo(() => t('phone'), [t]);
  const socialFieldLabel = useMemo(() => t('social'), [t]);
  const verifiedText = useMemo(() => t('verified'), [t]);
  const unverifiedText = useMemo(() => t('unverified'), [t]);
  const processUser = useMemo((): ProcessedUser => {
    if (!currentUser) {
      return {
        name: '',
        emails: [],
        phoneNumbers: [],
        socialAccounts: [],
      };
    }

    return {
      name: currentUser.fullName,
      username: currentUser.identifiers.find(id => id.type === 'username')?.value,
      emails: currentUser.identifiers.filter(id => id.type === 'email'),
      phoneNumbers: currentUser.identifiers.filter(id => id.type === 'phone'),
      socialAccounts: currentUser.socialAccounts,
    };
  }, [currentUser]);

  const getCurrentUser = useCallback(
    async (abortController?: AbortController) => {
      setLoading(true);
      const result = await getFullUser(abortController);
      if (result.err && result.val.ignore) {
        return;
      }

      if (!result || result?.err) {
        throw new Error(result?.val.name);
      }

      setCurrentUser(result.val);
      setName(result.val.fullName || "");
      let usernameIdentifier = result.val.identifiers.find(identifier => identifier.type == LoginIdentifierType.Username);
      setUsername(usernameIdentifier?.value || "");
      usernameIdentifierID = usernameIdentifier?.id || "";
      setLoading(false);
    },
    [corbadoApp],
  );

  const copyName = async () => {
    await navigator.clipboard.writeText(name);
  };

  const copyUsername = async () => {
    await navigator.clipboard.writeText(processUser.username || '');
  };

  if (!isAuthenticated) {
    return <div>{t('warning_notLoggedIn')}</div>;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <PasskeyListErrorBoundary globalError={globalError}>
      <div className='cb-user-details-container'>
        <Text className='cb-user-details-title'>{t('title')}</Text>
        {name !== "" && (
          <div className='cb-user-details-card'>
            <Text className='cb-user-details-header'>{nameFieldLabel}</Text>
            <div className='cb-user-details-body'>
              <div className='cb-user-details-body-row'>
                <InputField
                  // key={`user-entry-${processUser.name}`}
                  value={name}
                  disabled={!editingName}
                  onChange={e => setName(e.target.value)}
                />
                <CopyIcon
                  className='cb-user-details-body-row-icon'
                  color='secondary'
                  onClick={() => void copyName()}
                />
              </div>
              {editingName ? (
                <div>
                  <Button
                      className='cb-user-details-body-button-primary'
                      onClick={async () => {console.log(await updateName(name)); setEditingName(false); void getCurrentUser()}}>
                    <Text className='cb-user-details-subheader'>Save</Text>
                  </Button>
                  <Button
                      className='cb-user-details-body-button-secondary'
                      onClick={() => {setName(processUser.name); setEditingName(false)}}>
                    <Text className='cb-user-details-subheader'>Cancel</Text>
                  </Button>
                </div>
              ) : (
                <Button
                    className='cb-user-details-body-button'
                    onClick={() => setEditingName(true)}>
                  <ChangeIcon className='cb-user-details-body-button-icon' />
                  <Text className='cb-user-details-subheader'>Change</Text>
                </Button>
              )}
            </div>
          </div>
        )}
        {username !== "" && (
          <div className='cb-user-details-card'>
            <Text className='cb-user-details-header'>{usernameFieldLabel}</Text>
            <div className='cb-user-details-body'>
              <div className='cb-user-details-body-row'>
                <InputField
                  // key={`user-entry-${processUser.username}`}
                  value={processUser.username}
                  disabled={!editingUsername}
                  onChange={e => setName(e.target.value)}
                />
                <CopyIcon
                  className='cb-user-details-body-row-icon'
                  color='secondary'
                  onClick={() => void copyUsername()}
                />
              </div>
              {editingUsername ? (
                <div>
                  <Button
                      className='cb-user-details-body-button-primary'
                      onClick={async () => {console.log(await updateUsername(usernameIdentifierID, username)); setEditingUsername(false); void getCurrentUser()}}>
                    <Text className='cb-user-details-subheader'>Save</Text>
                  </Button>
                  <Button
                      className='cb-user-details-body-button-secondary'
                      onClick={() => {setName(processUser.name); setEditingUsername(false)}}>
                    <Text className='cb-user-details-subheader'>Cancel</Text>
                  </Button>
                </div>
              ) : (
                <Button
                    className='cb-user-details-body-button'
                    onClick={() => setEditingUsername(true)}>
                  <ChangeIcon className='cb-user-details-body-button-icon' />
                  <Text className='cb-user-details-subheader'>Change</Text>
                </Button>
              )}
            </div>
          </div>
        )}
        <div className='cb-user-details-section-indentifiers-list'>
          {processUser.emails.map((email, i) => (
            <div className='cb-user-details-card'>
              <div
                className='cb-user-details-section-indentifiers-list-item'
                key={`user-details-email-${email.value}`}
              >
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
                  className={`cb-user-details-section-indentifiers-list-item-badge cb-user-details-section-indentifiers-list-item-badge-${
                    email.status === 'verified' ? 'primary' : 'secondary'
                  }`}
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
            </div>
          ))}
        </div>
        <div className='cb-user-details-section-indentifiers-list'>
          {processUser.phoneNumbers.map((phone, i) => (
            <div className='cb-user-details-card'>
              <div
                className='cb-user-details-section-indentifiers-list-item'
                key={`user-details-phone-${phone.value}`}
              >
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
                  className={`cb-user-details-section-indentifiers-list-item-badge cb-user-details-section-indentifiers-list-item-badge-${
                    phone.status === 'verified' ? 'primary' : 'secondary'
                  }`}
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
            </div>
          ))}
        </div>
        <div className='cb-user-details-section-indentifiers-list'>
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
                    label={i === 0 ? socialFieldLabel : undefined}
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
        </div>
      </div>
    </PasskeyListErrorBoundary>
  );
};
