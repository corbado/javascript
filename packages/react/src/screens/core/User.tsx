import { LoginIdentifierType } from '@corbado/shared-ui';
import { type CorbadoUser, type Identifier, type SocialAccount } from '@corbado/types';
import { LoginIdentifierType1 } from '@corbado/web-core/dist/api/v2';
import type { FC } from 'react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, InputField, LoadingSpinner, PasskeyListErrorBoundary, PhoneInputField, Text } from '../../components';
import { AddIcon } from '../../components/ui/icons/AddIcon';
import { ChangeIcon } from '../../components/ui/icons/ChangeIcon';
import { CopyIcon } from '../../components/ui/icons/CopyIcon';
import { PendingIcon } from '../../components/ui/icons/PendingIcon';
import { PrimaryIcon } from '../../components/ui/icons/PrimaryIcon';
import { VerifiedIcon } from '../../components/ui/icons/VerifiedIcon';
import { useCorbado } from '../../hooks/useCorbado';

interface ProcessedUser {
  name: string;
  username: string;
  emails: Identifier[];
  phoneNumbers: Identifier[];
  socialAccounts: SocialAccount[];
}

export const User: FC = () => {
  const { corbadoApp, isAuthenticated, globalError, getFullUser, getIdentifierListConfig, updateName, updateUsername, createIdentifier } = useCorbado();
  const { t } = useTranslation('translation', { keyPrefix: 'user' });
  const [currentUser, setCurrentUser] = useState<CorbadoUser | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  const [fullNameRequired, setFullNameRequired] = useState<boolean>(false);
  const [usernameEnabled, setUsernameEnabled] = useState<boolean>(false);
  const [emailEnabled, setEmailEnabled] = useState<boolean>(false);
  // const [phoneEnabled, setPhoneEnabled] = useState<boolean>(false);

  const [name, setName] = useState<string | undefined>();
  const [editingName, setEditingName] = useState<boolean>(false);

  const [username, setUsername] = useState<Identifier | undefined>();
  const [editingUsername, setEditingUsername] = useState<boolean>(false);

  const [emails, setEmails] = useState<Identifier[]>([]);
  const [addingEmail, setAddingEmail] = useState<boolean>(false);
  const [newEmail, setNewEmail] = useState<string>("");


  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const abortController = new AbortController();
    void getCurrentUser(abortController);
    void getConfig(abortController);

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
        username: '',
        emails: [],
        phoneNumbers: [],
        socialAccounts: [],
      };
    }

    return {
      name: currentUser.fullName,
      username: currentUser.identifiers.find(id => id.type === 'username')?.value || '',
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
      const usernameIdentifier = result.val.identifiers.find(identifier => identifier.type == LoginIdentifierType.Username);
      setUsername(usernameIdentifier);
      setEmails(result.val.identifiers.filter(identifier => identifier.type == LoginIdentifierType.Email));
      setLoading(false);
    },
    [corbadoApp],
  );

  const getConfig = useCallback(
    async (abortController?: AbortController) => {
      setLoading(true);
      const result = await getIdentifierListConfig(abortController);
      if (result.err && result.val.ignore) {
        return;
      }

      if (!result || result?.err) {
        throw new Error(result?.val.name);
      }

      setFullNameRequired(result.val.fullNameRequired);
      for (const identifierConfig of result.val.identifiers) {
        if (identifierConfig.type === LoginIdentifierType1.Custom) {
          setUsernameEnabled(true);
        } else if (identifierConfig.type === LoginIdentifierType1.Email) {
          setEmailEnabled(true);
        } else if (identifierConfig.type === LoginIdentifierType1.PhoneNumber) {
          // setPhoneEnabled(true);
        }
      }
      setLoading(false);
    },
    [corbadoApp],
  );

  const copyName = async () => {
    if (name) {
      await navigator.clipboard.writeText(name);
    }
  };

  const changeName = async () => {
    // TODO: input checking?
    if (name) {
      await updateName(name);
    }
    setEditingName(false);
    void getCurrentUser();
  };

  const copyUsername = async () => {
    await navigator.clipboard.writeText(username?.value || "");
  };

  const changeUsername = async () => {
    // TODO: input checking?
    if (username) {
      await updateUsername(username.id, username.value);
    }
    setEditingUsername(false);
    void getCurrentUser();
  };

  const addEmail = async () => {
    await createIdentifier(LoginIdentifierType.Email, newEmail);
    setNewEmail("");
    setAddingEmail(false);
    void getCurrentUser();
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
        {fullNameRequired && (
          <div className='cb-user-details-card'>
            <Text className='cb-user-details-header'>{nameFieldLabel}</Text>
            <div className='cb-user-details-body'>
              <div className='cb-user-details-body-row'>
                <InputField
                  className='cb-user-details-text'
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
                      onClick={() => void changeName()}>
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
        {usernameEnabled && username && (
          <div className='cb-user-details-card'>
            <Text className='cb-user-details-header'>{usernameFieldLabel}</Text>
            <div className='cb-user-details-body'>
              <div className='cb-user-details-body-row'>
                <InputField
                  className='cb-user-details-text'
                  // key={`user-entry-${processUser.username}`}
                  value={username.value}
                  disabled={!editingUsername}
                  onChange={e => setUsername({ ...username, value: e.target.value })}
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
                      onClick={() => void changeUsername()}>
                    <Text className='cb-user-details-subheader'>Save</Text>
                  </Button>
                  <Button
                      className='cb-user-details-body-button-secondary'
                      onClick={() => {setUsername({ ...username, value: processUser.username }); setEditingUsername(false)}}>
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
        {emailEnabled && emails.length > 0 && (
          <div className='cb-user-details-card'>
            <Text className='cb-user-details-header'>{emailFieldLabel}</Text>
            <div className='cb-user-details-body'>
              {processUser.emails.map((email) => (
                <div className='cb-user-details-identifier-container'>
                  <div className='cb-user-details-body-row'>
                    <Text className='cb-user-details-text'>{email.value}</Text>
                    <div className='cb-user-details-header-badge-section'>
                      {email.status === 'primary' ? (
                        <div className='cb-user-details-header-badge'>
                          <PrimaryIcon className='cb-user-details-header-badge-icon' />
                          <Text className='cb-user-details-text-primary'>Primary</Text>
                        </div>
                      ) : email.status === 'verified' ? (
                        <div className='cb-user-details-header-badge'>
                          <VerifiedIcon className='cb-user-details-header-badge-icon' />
                          <Text className='cb-user-details-text-primary'>Verified</Text>
                        </div>
                      ) : (
                        <div className='cb-user-details-header-badge'>
                          <PendingIcon className='cb-user-details-header-badge-icon' />
                          <Text className='cb-user-details-text-primary'>Pending</Text>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {addingEmail ? (
                <div className='cb-user-details-identifier-container'>
                  <InputField
                    className='cb-user-details-text'
                    style={{width: '100%'}}
                    // key={`user-entry-${processUser.username}`}
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                  />
                  <Button
                      className='cb-user-details-body-button-primary'
                      onClick={() => void addEmail()}>
                    <Text className='cb-user-details-subheader'>Save</Text>
                  </Button>
                  <Button
                      className='cb-user-details-body-button-secondary'
                      onClick={() => {setAddingEmail(false)}}>
                    <Text className='cb-user-details-subheader'>Cancel</Text>
                  </Button>
                </div>
              ) : (
                <Button
                    className='cb-user-details-body-button'
                    onClick={() => setAddingEmail(true)}>
                  <AddIcon color='secondary' className='cb-user-details-body-button-icon' />
                  <Text className='cb-user-details-subheader'>Add Another</Text>
                </Button>
              )}
            </div>
          </div>
        )}
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
