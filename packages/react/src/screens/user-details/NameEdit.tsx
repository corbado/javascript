import type { FC, MouseEvent } from 'react';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, InputField, Text } from '../../components';
import CopyButton from '../../components/ui/buttons/CopyButton';
import { AddIcon } from '../../components/ui/icons/AddIcon';
import { ChangeIcon } from '../../components/ui/icons/ChangeIcon';
import UserDetailsCard from '../../components/user-details/UserDetailsCard';
import { useCorbado } from '../../hooks/useCorbado';
import { useCorbadoUserDetails } from '../../hooks/useCorbadoUserDetails';

const NameEdit: FC = () => {
  const { updateFullName } = useCorbado();
  const { name, getCurrentUser, processUser, setName, fullNameRequired } = useCorbadoUserDetails();
  const { t } = useTranslation('translation');

  const [editingName, setEditingName] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const headerName = useMemo(() => t('user-details.name'), [t]);
  const buttonAddName = useMemo(() => t('user-details.add_name'), [t]);

  const buttonSave = useMemo(() => t('user-details.save'), [t]);
  const buttonCancel = useMemo(() => t('user-details.cancel'), [t]);
  const buttonChange = useMemo(() => t('user-details.change'), [t]);

  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const changeName = async () => {
    setErrorMessage(undefined);

    if (loading) return;

    if (!name) {
      setErrorMessage(t('user-details.name_required'));
      return;
    }

    setLoading(true);
    const res = await updateFullName(name);
    if (res.err) {
      // no possible error code
      console.error(res.val.message);
      setLoading(false);
      return;
    }

    void getCurrentUser()
      .then(() => setEditingName(false))
      .finally(() => {
        setLoading(false);
      });
  };

  if (!processUser || !fullNameRequired) {
    return;
  }

  const onCancel = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setName(processUser.name);
    setEditingName(false);
    setErrorMessage(undefined);
  };

  return (
    <UserDetailsCard header={headerName}>
      {!processUser.name && !editingName ? (
        <Button
          className='cb-user-details-body-button'
          onClick={() => setEditingName(true)}
        >
          <AddIcon
            color='secondary'
            className='cb-user-details-body-button-icon'
          />
          <Text className='cb-user-details-subheader'>{buttonAddName}</Text>
        </Button>
      ) : (
        <form
          onSubmit={e => {
            e.preventDefault();
          }}
        >
          <div className='cb-user-details-body-row'>
            <InputField
              className='cb-user-details-input'
              value={name}
              disabled={!editingName}
              onChange={e => setName(e.target.value)}
              errorMessage={errorMessage}
            />
            <CopyButton text={name} />
          </div>
          {editingName ? (
            <div>
              <Button
                className='cb-user-details-body-button-primary'
                type='submit'
                isLoading={loading}
                onClick={() => {
                  void changeName();
                }}
                spinnerClassName='cb-user-details-button-spinner'
              >
                <Text className='cb-user-details-subheader'>{buttonSave}</Text>
              </Button>
              <Button
                type='button'
                className='cb-user-details-body-button-secondary'
                onClick={onCancel}
              >
                <Text className='cb-user-details-subheader'>{buttonCancel}</Text>
              </Button>
            </div>
          ) : (
            <Button
              className='cb-user-details-body-button'
              type='button'
              onClick={() => {
                setEditingName(true);
              }}
            >
              <ChangeIcon className='cb-user-details-body-button-icon' />
              <Text className='cb-user-details-subheader'>{buttonChange}</Text>
            </Button>
          )}
        </form>
      )}
    </UserDetailsCard>
  );
};

export default NameEdit;
