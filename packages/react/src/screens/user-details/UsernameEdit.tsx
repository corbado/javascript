import { LoginIdentifierType } from '@corbado/shared-ui';
import { t } from 'i18next';
import React, { useMemo, useState } from 'react';

import { Button, InputField, Text } from '../../components';
import CopyButton from '../../components/ui/buttons/CopyButton';
import { AddIcon } from '../../components/ui/icons/AddIcon';
import { ChangeIcon } from '../../components/ui/icons/ChangeIcon';
import { CopyIcon } from '../../components/ui/icons/CopyIcon';
import UserDetailsCard from '../../components/user-details/UserDetailsCard';
import { useCorbado } from '../../hooks/useCorbado';
import { useCorbadoUserDetails } from '../../hooks/useCorbadoUserDetails';
import { getErrorCode } from '../../util';

const UsernameEdit = () => {
  const { createIdentifier, updateUsername } = useCorbado();
  const { username, getCurrentUser, setUsername, processUser, usernameEnabled } = useCorbadoUserDetails();

  const [addingUsername, setAddingUsername] = useState<boolean>(false);
  const [editingUsername, setEditingUsername] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [newUsername, setNewUsername] = useState<string | undefined>(username?.value);

  const [errorMessage, setErrorMessage] = useState<string>();

  const headerUsername = useMemo(() => t('user-details.username'), [t]);
  const buttonSave = useMemo(() => t('user-details.save'), [t]);
  const buttonCancel = useMemo(() => t('user-details.cancel'), [t]);
  const buttonChange = useMemo(() => t('user-details.change'), [t]);
  const buttonAddUsername = useMemo(() => t('user-details.add_username'), [t]);

  const copyUsername = async () => {
    await navigator.clipboard.writeText(username?.value || '');
  };

  const addUsername = async () => {
    setErrorMessage(undefined);

    if (loading) {
      return;
    }

    if (!username || !username.value) {
      setErrorMessage(t('user-details.username_required'));
      return;
    }
    const res = await createIdentifier(LoginIdentifierType.Username, username?.value || '');
    if (res.err) {
      const code = getErrorCode(res.val.message);
      if (code) {
        if (code === 'identifier_already_in_use') {
          setErrorMessage(t('user-details.username_unique'));
        }

        if (code === 'identifier_invalid_format') {
          setErrorMessage(t('errors.identifier_invalid_format.username'));
        }

        console.error(t(`errors.${code}`));
      }

      setLoading(false);
      return;
    }

    void getCurrentUser()
      .then(() => {
        setAddingUsername(false);
        setErrorMessage(undefined);
      })
      .finally(() => setLoading(false));
  };

  const changeUsername = async () => {
    setErrorMessage(undefined);

    if (loading) {
      return;
    }

    setLoading(true);

    if (!username || !newUsername) {
      setErrorMessage(t('user-details.username_required'));
      return;
    }

    if (username.value === newUsername) {
      setErrorMessage(t('user-details.username_unique'));
      return;
    }

    const res = await updateUsername(username.id, newUsername);
    if (res.err) {
      const code = getErrorCode(res.val.message);

      if (code === 'identifier_already_in_use') {
        setErrorMessage(t('user-details.username_unique'));
      }

      if (code === 'identifier_invalid_format') {
        setErrorMessage(t('errors.identifier_invalid_format.username'));
      }

      setLoading(false);
      console.error(res.val.message);
      return;
    }

    void getCurrentUser()
      .then(() => setEditingUsername(false))
      .finally(() => setLoading(false));
  };

  if (!processUser || !usernameEnabled) {
    return;
  }

  return (
    <UserDetailsCard header={headerUsername}>
      {!processUser.username ? (
        <div>
          {addingUsername ? (
            <form
              onSubmit={e => {
                e.preventDefault();
                void addUsername();
              }}
            >
              <div className='cb-user-details-body-row'>
                <InputField
                  className='cb-user-details-input'
                  value={username?.value}
                  errorMessage={errorMessage}
                  onChange={e => setUsername({ id: '', type: 'username', status: 'verified', primary: false, value: e.target.value })}
                />
                <CopyIcon
                  className='cb-user-details-body-row-icon'
                  color='secondary'
                  onClick={() => void copyUsername()}
                />
              </div>
              <Button
                className='cb-user-details-body-button-primary'
                isLoading={loading}
                spinnerClassName='cb-user-details-button-spinner'
                onClick={() => void addUsername()}
              >
                <Text className='cb-user-details-subheader'>{buttonSave}</Text>
              </Button>
              <Button
                className='cb-user-details-body-button-secondary'
                onClick={() => {
                  setUsername(undefined);
                  setAddingUsername(false);
                  setErrorMessage(undefined);
                }}
              >
                <Text className='cb-user-details-subheader'>{buttonCancel}</Text>
              </Button>
            </form>
          ) : (
            <Button
              className='cb-user-details-body-button'
              onClick={() => setAddingUsername(true)}
            >
              <AddIcon
                color='secondary'
                className='cb-user-details-body-button-icon'
              />
              <Text className='cb-user-details-subheader'>{buttonAddUsername}</Text>
            </Button>
          )}
        </div>
      ) : (
        <div>
          {username && (
            <form onSubmit={e => e.preventDefault()}>
              <div className='cb-user-details-body-row'>
                <InputField
                  className='cb-user-details-input'
                  value={editingUsername ? newUsername : username.value}
                  disabled={!editingUsername}
                  errorMessage={errorMessage}
                  onChange={e => setNewUsername(e.target.value)}
                />
                <CopyButton text={username.value} />
              </div>
              {editingUsername ? (
                <div>
                  <Button
                    type='submit'
                    className='cb-user-details-body-button-primary'
                    isLoading={loading}
                    onClick={() => void changeUsername()}
                    spinnerClassName='cb-user-details-button-spinner'
                  >
                    <Text className='cb-user-details-subheader'>{buttonSave}</Text>
                  </Button>
                  <Button
                    className='cb-user-details-body-button-secondary'
                    type='button'
                    onClick={() => {
                      setNewUsername(username.value);
                      setEditingUsername(false);
                      setErrorMessage(undefined);
                    }}
                  >
                    <Text className='cb-user-details-subheader'>{buttonCancel}</Text>
                  </Button>
                </div>
              ) : (
                <Button
                  className='cb-user-details-body-button'
                  type='button'
                  onClick={() => setEditingUsername(true)}
                >
                  <ChangeIcon className='cb-user-details-body-button-icon' />
                  <Text className='cb-user-details-subheader'>{buttonChange}</Text>
                </Button>
              )}
            </form>
          )}
        </div>
      )}
    </UserDetailsCard>
  );
};

export default UsernameEdit;
