import React, { useMemo, useState } from 'react';
import { useCorbado } from '../../hooks/useCorbado';
import { useCorbadoUserDetails } from '../../hooks/useCorbadoUserDetails';
import { LoginIdentifierType } from '@corbado/types';
import { getErrorCode } from '../../util';
import { t } from 'i18next';
import { InputField, Button, Text } from '../../components';
import { AddIcon } from '../../components/ui/icons/AddIcon';
import { ChangeIcon } from '../../components/ui/icons/ChangeIcon';
import { CopyIcon } from '../../components/ui/icons/CopyIcon';

const UsernameEdit = () => {
  const { createIdentifier, updateUsername } = useCorbado();
  const { username, getCurrentUser, setUsername, processUser, usernameEnabled } = useCorbadoUserDetails();

  const [addingUsername, setAddingUsername] = useState<boolean>(false);
  const [editingUsername, setEditingUsername] = useState<boolean>(false);

  const headerUsername = useMemo(() => t('user-details.username'), [t]);
  const buttonSave = useMemo(() => t('user-details.save'), [t]);
  const buttonCancel = useMemo(() => t('user-details.cancel'), [t]);
  const buttonChange = useMemo(() => t('user-details.change'), [t]);
  const buttonAddUsername = useMemo(() => t('user-details.add_username'), [t]);

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

  if (!processUser || !usernameEnabled) return;

  return (
    <div className='cb-user-details-card'>
      <Text className='cb-user-details-header'>{headerUsername}</Text>
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
                    onChange={e => setUsername({ id: '', type: 'username', status: 'verified', value: e.target.value })}
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
                  <Text className='cb-user-details-subheader'>{buttonSave}</Text>
                </Button>
                <Button
                  className='cb-user-details-body-button-secondary'
                  onClick={() => {
                    setUsername(undefined);
                    setAddingUsername(false);
                  }}
                >
                  <Text className='cb-user-details-subheader'>{buttonCancel}</Text>
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
                <Text className='cb-user-details-subheader'>{buttonAddUsername}</Text>
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
                      <Text className='cb-user-details-subheader'>{buttonSave}</Text>
                    </Button>
                    <Button
                      className='cb-user-details-body-button-secondary'
                      onClick={() => {
                        setUsername({ ...username, value: processUser.username });
                        setEditingUsername(false);
                      }}
                    >
                      <Text className='cb-user-details-subheader'>{buttonCancel}</Text>
                    </Button>
                  </div>
                ) : (
                  <Button
                    className='cb-user-details-body-button'
                    onClick={() => setEditingUsername(true)}
                  >
                    <ChangeIcon className='cb-user-details-body-button-icon' />
                    <Text className='cb-user-details-subheader'>{buttonChange}</Text>
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsernameEdit;
