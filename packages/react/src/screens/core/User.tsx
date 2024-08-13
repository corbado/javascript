import { LoginIdentifierConfigType, LoginIdentifierType } from '@corbado/shared-ui';
import { type CorbadoUser, type Identifier, type SocialAccount } from '@corbado/types';
import type { FC } from 'react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, InputField, LoadingSpinner, PasskeyListErrorBoundary, Text } from '../../components';
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
  const {
    corbadoApp,
    isAuthenticated,
    globalError,
    getFullUser,
    getIdentifierListConfig,
    updateName,
    updateUsername,
    createIdentifier,
    deleteIdentifier,
    verifyIdentifierStart,
    verifyIdentifierFinish,
  } = useCorbado();
  const { t } = useTranslation('translation');
  const [currentUser, setCurrentUser] = useState<CorbadoUser | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  const [fullNameRequired, setFullNameRequired] = useState<boolean>(false);
  const [usernameEnabled, setUsernameEnabled] = useState<boolean>(false);
  const [emailEnabled, setEmailEnabled] = useState<boolean>(false);
  const [phoneEnabled, setPhoneEnabled] = useState<boolean>(false);

  const [name, setName] = useState<string | undefined>();
  const [editingName, setEditingName] = useState<boolean>(false);

  const [username, setUsername] = useState<Identifier | undefined>();
  const [addingUsername, setAddingUsername] = useState<boolean>(false);
  const [editingUsername, setEditingUsername] = useState<boolean>(false);

  const [emails, setEmails] = useState<Identifier[]>([]);
  const [verifyingEmails, setVerifyingEmails] = useState<boolean[]>([]);
  const [emailChallengeCodes, setEmailChallengeCodes] = useState<string[]>([]);
  const [addingEmail, setAddingEmail] = useState<boolean>(false);
  const [newEmail, setNewEmail] = useState<string>('');

  const [phones, setPhones] = useState<Identifier[]>([]);
  const [verifyingPhones, setVerifyingPhones] = useState<boolean[]>([]);
  const [phoneChallengeCodes, setPhoneChallengeCodes] = useState<string[]>([]);
  const [addingPhone, setAddingPhone] = useState<boolean>(false);
  const [newPhone, setNewPhone] = useState<string>('');

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

  const nameFieldLabel = useMemo(() => t('user.name'), [t]);
  const usernameFieldLabel = useMemo(() => t('user.username'), [t]);
  const emailFieldLabel = useMemo(() => t('user.email'), [t]);
  const phoneFieldLabel = useMemo(() => t('user.phone'), [t]);
  const socialFieldLabel = useMemo(() => t('user.social'), [t]);
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
      setName(result.val.fullName || '');
      const usernameIdentifier = result.val.identifiers.find(
        identifier => identifier.type == LoginIdentifierType.Username,
      );
      setUsername(usernameIdentifier);
      const emails = result.val.identifiers.filter(identifier => identifier.type == LoginIdentifierType.Email);
      setEmails(emails);
      setVerifyingEmails(emails.map(() => false));
      setEmailChallengeCodes(emails.map(() => ''));
      const phones = result.val.identifiers.filter(identifier => identifier.type == LoginIdentifierType.Phone);
      setPhones(phones);
      setVerifyingPhones(phones.map(() => false));
      setPhoneChallengeCodes(phones.map(() => ''));
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
        if (identifierConfig.type === LoginIdentifierConfigType.Username) {
          setUsernameEnabled(true);
        } else if (identifierConfig.type === LoginIdentifierConfigType.Email) {
          setEmailEnabled(true);
        } else if (identifierConfig.type === LoginIdentifierConfigType.Phone) {
          setPhoneEnabled(true);
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
    if (!name) {
      console.error('name is empty');
      return;
    }
    const res = await updateName(name);
    if (res.err) {
      // no possible error code
      console.error(res.val.message);
      return;
    }
    setEditingName(false);
    void getCurrentUser();
  };

  const copyUsername = async () => {
    await navigator.clipboard.writeText(username?.value || '');
  };

  const addUsername = async () => {
    if (!username || !username.value) {
      console.error('username is empty');
      return;
    }
    const res = await createIdentifier(LoginIdentifierType.Username, username?.value || '');
    if (res.err) {
      const code = getErrorCode(res.val.message);
      if (code) {
        // possible code: unsupported_identifier_type (but the current UI flow should prevent this, because unsupported types are not shown)
        console.error(t(`errors.${code}`));
      }
      return;
    }
    setAddingUsername(false);
    void getCurrentUser();
  };

  const changeUsername = async () => {
    if (!username || !username.value) {
      console.error('username is empty');
      return;
    }
    const res = await updateUsername(username.id, username.value);
    if (res.err) {
      // no possible error code
      console.error(res.val.message);
      return;
    }
    setEditingUsername(false);
    void getCurrentUser();
  };

  const addEmail = async () => {
    if (!newEmail) {
      console.error('email is empty');
      return;
    }
    const res = await createIdentifier(LoginIdentifierType.Email, newEmail);
    if (res.err) {
      const code = getErrorCode(res.val.message);
      if (code) {
        // possible code: unsupported_identifier_type (but the current UI flow should prevent this, because unsupported types are not shown)
        console.error(t(`errors.${code}`));
      }
      return;
    }
    setNewEmail('');
    setAddingEmail(false);
    void getCurrentUser();
  };

  const removeEmail = async (index: number) => {
    const res = await deleteIdentifier(emails[index].id);
    if (res.err) {
      const code = getErrorCode(res.val.message);
      if (code) {
        // possible codes: no_remaining_identifier, no_remaining_verified_identifier
        console.error(t(`errors.${code}`));
      }
      return;
    }
    void getCurrentUser();
  };

  const startEmailVerification = async (index: number) => {
    const res = await verifyIdentifierStart(emails[index].id);
    if (res.err) {
      const code = getErrorCode(res.val.message);
      if (code) {
        // possible code: wait_before_retry
        console.error(t(`errors.${code}`));
      }
      return;
    }
    setVerifyingEmails(verifyingEmails.map((v, i) => (i === index ? true : v)));
  };

  const finishEmailVerification = async (index: number) => {
    const res = await verifyIdentifierFinish(emails[index].id, emailChallengeCodes[index]);
    if (res.err) {
      const code = getErrorCode(res.val.message);
      if (code) {
        // possible code: invalid_challenge_solution_email-otp
        console.error(t(`errors.${code}`));
      }
      return;
    }
    void getCurrentUser();
  };

  const addPhone = async () => {
    if (!newPhone) {
      console.error('phone is empty');
      return;
    }
    const res = await createIdentifier(LoginIdentifierType.Phone, newPhone);
    if (res.err) {
      const code = getErrorCode(res.val.message);
      if (code) {
        // possible code: unsupported_identifier_type (but the current UI flow should prevent this, because unsupported types are not shown)
        console.error(t(`errors.${code}`));
      }
      return;
    }
    setNewPhone('');
    setAddingPhone(false);
    void getCurrentUser();
  };

  const removePhone = async (index: number) => {
    const res = await deleteIdentifier(phones[index].id);
    if (res.err) {
      const code = getErrorCode(res.val.message);
      if (code) {
        // possible codes: no_remaining_identifier, no_remaining_verified_identifier
        console.error(t(`errors.${code}`));
      }
      return;
    }
    void getCurrentUser();
  };

  const startPhoneVerification = async (index: number) => {
    const res = await verifyIdentifierStart(phones[index].id);
    if (res.err) {
      const code = getErrorCode(res.val.message);
      if (code) {
        // possible code: wait_before_retry
        console.error(t(`errors.${code}`));
      }
      return;
    }
    setVerifyingPhones(verifyingPhones.map((v, i) => (i === index ? true : v)));
  };

  const finishPhoneVerification = async (index: number) => {
    const res = await verifyIdentifierFinish(phones[index].id, phoneChallengeCodes[index]);
    if (res.err) {
      const code = getErrorCode(res.val.message);
      if (code) {
        // possible code: invalid_challenge_solution_phone-otp
        console.error(t(`errors.${code}`));
      }
      return;
    }
    void getCurrentUser();
  };

  const getErrorCode = (message: string) => {
    const regex = /\(([^)]+)\)/;
    const matches = regex.exec(message);
    return matches ? matches[1] : undefined;
  };

  if (!isAuthenticated) {
    return <div>{t('user.warning_notLoggedIn')}</div>;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <PasskeyListErrorBoundary globalError={globalError}>
      <div className='cb-user-details-container'>
        <Text className='cb-user-details-title'>{t('user.title')}</Text>
        {fullNameRequired && (
          <div className='cb-user-details-card'>
            <Text className='cb-user-details-header'>{nameFieldLabel}</Text>
            <div className='cb-user-details-body'>
              {!processUser.name && !editingName ? (
                <Button
                  className='cb-user-details-body-button'
                  onClick={() => setEditingName(true)}
                >
                  <AddIcon
                    color='secondary'
                    className='cb-user-details-body-button-icon'
                  />
                  <Text className='cb-user-details-subheader'>Add Name</Text>
                </Button>
              ) : (
                <div>
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
                        onClick={() => void changeName()}
                      >
                        <Text className='cb-user-details-subheader'>Save</Text>
                      </Button>
                      <Button
                        className='cb-user-details-body-button-secondary'
                        onClick={() => {
                          setName(processUser.name);
                          setEditingName(false);
                        }}
                      >
                        <Text className='cb-user-details-subheader'>Cancel</Text>
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className='cb-user-details-body-button'
                      onClick={() => setEditingName(true)}
                    >
                      <ChangeIcon className='cb-user-details-body-button-icon' />
                      <Text className='cb-user-details-subheader'>Change</Text>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {usernameEnabled && (
          <div className='cb-user-details-card'>
            <Text className='cb-user-details-header'>{usernameFieldLabel}</Text>
            <div className='cb-user-details-body'>
              {!processUser.username ? (
                <div>
                  {addingUsername ? (
                    <div>
                      <div className='cb-user-details-body-row'>
                        <InputField
                          className='cb-user-details-text'
                          // key={`user-entry-${processUser.username}`}
                          value={username?.value}
                          onChange={e =>
                            setUsername({ id: '', type: 'username', status: 'verified', value: e.target.value })
                          }
                        />
                        <CopyIcon
                          className='cb-user-details-body-row-icon'
                          color='secondary'
                          onClick={() => void copyUsername()}
                        />
                      </div>
                      <Button
                        className='cb-user-details-body-button-primary'
                        onClick={() => void addUsername()}
                      >
                        <Text className='cb-user-details-subheader'>Save</Text>
                      </Button>
                      <Button
                        className='cb-user-details-body-button-secondary'
                        onClick={() => {
                          setUsername(undefined);
                          setAddingUsername(false);
                        }}
                      >
                        <Text className='cb-user-details-subheader'>Cancel</Text>
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className='cb-user-details-body-button'
                      onClick={() => setAddingUsername(true)}
                    >
                      <AddIcon
                        color='secondary'
                        className='cb-user-details-body-button-icon'
                      />
                      <Text className='cb-user-details-subheader'>Add Username</Text>
                    </Button>
                  )}
                </div>
              ) : (
                <div>
                  {username && (
                    <div>
                      <div className='cb-user-details-body-row'>
                        <InputField
                          className='cb-user-details-text'
                          // key={`user-entry-${processUser.username}`}
                          value={username?.value}
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
                            onClick={() => void changeUsername()}
                          >
                            <Text className='cb-user-details-subheader'>Save</Text>
                          </Button>
                          <Button
                            className='cb-user-details-body-button-secondary'
                            onClick={() => {
                              setUsername({ ...username, value: processUser.username });
                              setEditingUsername(false);
                            }}
                          >
                            <Text className='cb-user-details-subheader'>Cancel</Text>
                          </Button>
                        </div>
                      ) : (
                        <Button
                          className='cb-user-details-body-button'
                          onClick={() => setEditingUsername(true)}
                        >
                          <ChangeIcon className='cb-user-details-body-button-icon' />
                          <Text className='cb-user-details-subheader'>Change</Text>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {emailEnabled && (
          <div className='cb-user-details-card'>
            <Text className='cb-user-details-header'>{emailFieldLabel}</Text>
            <div className='cb-user-details-body'>
              {emails.map((email, index) => (
                <div className='cb-user-details-identifier-container'>
                  {verifyingEmails[index] ? (
                    <div>
                      <Text className='cb-user-details-text'>Enter OTP code for: {email.value}</Text>
                      <InputField
                        className='cb-user-details-text'
                        onChange={e =>
                          setEmailChallengeCodes(emailChallengeCodes.map((c, i) => (i === index ? e.target.value : c)))
                        }
                      />
                      <Button
                        className='cb-user-details-body-button-primary'
                        onClick={() => void finishEmailVerification(index)}
                      >
                        <Text className='cb-user-details-subheader'>Enter</Text>
                      </Button>
                      <Button
                        className='cb-user-details-body-button-primary'
                        onClick={() => setVerifyingEmails(verifyingEmails.map((v, i) => (i === index ? false : v)))}
                      >
                        <Text className='cb-user-details-subheader'>Cancel</Text>
                      </Button>
                    </div>
                  ) : (
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
                      {email.status === 'pending' && (
                        <Button
                          className='cb-user-details-body-button-primary'
                          onClick={() => void startEmailVerification(index)}
                        >
                          <Text className='cb-user-details-subheader'>Verify</Text>
                        </Button>
                      )}
                      <Button
                        className='cb-user-details-body-button-secondary'
                        onClick={() => void removeEmail(index)}
                      >
                        <Text className='cb-user-details-subheader'>Delete</Text>
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              {addingEmail ? (
                <div className='cb-user-details-identifier-container'>
                  <InputField
                    className='cb-user-details-text'
                    style={{ width: '100%' }}
                    // key={`user-entry-${processUser.username}`}
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                  />
                  <Button
                    className='cb-user-details-body-button-primary'
                    onClick={() => void addEmail()}
                  >
                    <Text className='cb-user-details-subheader'>Save</Text>
                  </Button>
                  <Button
                    className='cb-user-details-body-button-secondary'
                    onClick={() => {
                      setAddingEmail(false);
                    }}
                  >
                    <Text className='cb-user-details-subheader'>Cancel</Text>
                  </Button>
                </div>
              ) : (
                <Button
                  className='cb-user-details-body-button'
                  onClick={() => setAddingEmail(true)}
                >
                  <AddIcon
                    color='secondary'
                    className='cb-user-details-body-button-icon'
                  />
                  <Text className='cb-user-details-subheader'>Add Email</Text>
                </Button>
              )}
            </div>
          </div>
        )}
        {phoneEnabled && (
          <div className='cb-user-details-card'>
            <Text className='cb-user-details-header'>{phoneFieldLabel}</Text>
            <div className='cb-user-details-body'>
              {phones.map((phone, index) => (
                <div className='cb-user-details-identifier-container'>
                  {verifyingPhones[index] ? (
                    <div>
                      <Text className='cb-user-details-text'>Enter OTP code for: {phone.value}</Text>
                      <InputField
                        className='cb-user-details-text'
                        onChange={e =>
                          setPhoneChallengeCodes(phoneChallengeCodes.map((c, i) => (i === index ? e.target.value : c)))
                        }
                      />
                      <Button
                        className='cb-user-details-body-button-primary'
                        onClick={() => void finishPhoneVerification(index)}
                      >
                        <Text className='cb-user-details-subheader'>Enter</Text>
                      </Button>
                      <Button
                        className='cb-user-details-body-button-primary'
                        onClick={() => setVerifyingPhones(verifyingPhones.map((v, i) => (i === index ? false : v)))}
                      >
                        <Text className='cb-user-details-subheader'>Cancel</Text>
                      </Button>
                    </div>
                  ) : (
                    <div className='cb-user-details-body-row'>
                      <Text className='cb-user-details-text'>{phone.value}</Text>
                      <div className='cb-user-details-header-badge-section'>
                        {phone.status === 'primary' ? (
                          <div className='cb-user-details-header-badge'>
                            <PrimaryIcon className='cb-user-details-header-badge-icon' />
                            <Text className='cb-user-details-text-primary'>Primary</Text>
                          </div>
                        ) : phone.status === 'verified' ? (
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
                      {phone.status === 'pending' && (
                        <Button
                          className='cb-user-details-body-button-primary'
                          onClick={() => void startPhoneVerification(index)}
                        >
                          <Text className='cb-user-details-subheader'>Verify</Text>
                        </Button>
                      )}
                      <Button
                        className='cb-user-details-body-button-secondary'
                        onClick={() => void removePhone(index)}
                      >
                        <Text className='cb-user-details-subheader'>Delete</Text>
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              {addingPhone ? (
                <div className='cb-user-details-identifier-container'>
                  <InputField
                    className='cb-user-details-text'
                    style={{ width: '100%' }}
                    // key={`user-entry-${processUser.username}`}
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                  />
                  <Button
                    className='cb-user-details-body-button-primary'
                    onClick={() => void addPhone()}
                  >
                    <Text className='cb-user-details-subheader'>Save</Text>
                  </Button>
                  <Button
                    className='cb-user-details-body-button-secondary'
                    onClick={() => {
                      setAddingPhone(false);
                    }}
                  >
                    <Text className='cb-user-details-subheader'>Cancel</Text>
                  </Button>
                </div>
              ) : (
                <Button
                  className='cb-user-details-body-button'
                  onClick={() => setAddingPhone(true)}
                >
                  <AddIcon
                    color='secondary'
                    className='cb-user-details-body-button-icon'
                  />
                  <Text className='cb-user-details-subheader'>Add Phone</Text>
                </Button>
              )}
            </div>
          </div>
        )}

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
