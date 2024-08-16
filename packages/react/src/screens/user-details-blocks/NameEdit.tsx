import React, { FC, useMemo, useState } from 'react';
import { Button, InputField, Text } from '../../components';
import { AddIcon } from '../../components/ui/icons/AddIcon';
import { ChangeIcon } from '../../components/ui/icons/ChangeIcon';
import { CopyIcon } from '../../components/ui/icons/CopyIcon';
import { useTranslation } from 'react-i18next';
import { useCorbadoUserDetails } from '../../hooks/useCorbadoUserDetails';
import { useCorbado } from '../..';

const NameEdit: FC = () => {
  const { updateName } = useCorbado();
  const { name, getCurrentUser, processUser, setName, fullNameRequired } = useCorbadoUserDetails();
  const { t } = useTranslation('translation');

  const [editingName, setEditingName] = useState<boolean>(false);

  const headerName = useMemo(() => t('user-details.name'), [t]);
  const buttonAddName = useMemo(() => t('user-details.add_name'), [t]);

  const buttonSave = useMemo(() => t('user-details.save'), [t]);
  const buttonCancel = useMemo(() => t('user-details.cancel'), [t]);
  const buttonChange = useMemo(() => t('user-details.change'), [t]);

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

  if (!processUser || !fullNameRequired) return;

  return (
    <div className='cb-user-details-card'>
      <Text className='cb-user-details-header'>{headerName}</Text>
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
            <Text className='cb-user-details-subheader'>{buttonAddName}</Text>
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
                  <Text className='cb-user-details-subheader'>{buttonSave}</Text>
                </Button>
                <Button
                  className='cb-user-details-body-button-secondary'
                  onClick={() => {
                    setName(processUser.name);
                    setEditingName(false);
                  }}
                >
                  <Text className='cb-user-details-subheader'>{buttonCancel}</Text>
                </Button>
              </div>
            ) : (
              <Button
                className='cb-user-details-body-button'
                onClick={() => setEditingName(true)}
              >
                <ChangeIcon className='cb-user-details-body-button-icon' />
                <Text className='cb-user-details-subheader'>{buttonChange}</Text>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NameEdit;
