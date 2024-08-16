import React, { useMemo } from 'react';
import { Button, Text } from '../../components';
import { t } from 'i18next';
import { useCorbado } from '../../hooks/useCorbado';

const UserDelete = () => {
  const { deleteUser } = useCorbado();

  const headerDelete = useMemo(() => t('user-details.delete_account'), [t]);
  const buttonDelete = useMemo(() => t('user-details.delete'), [t]);
  const textDelete = useMemo(() => t('user-details.delete_account_text'), [t]);

  const deleteAccount = async () => {
    const res = await deleteUser();
    if (res.err) {
      // no possible error code
      console.error(res.val.message);
      return;
    }
    // TODO: go back to login page?
  };

  return (
    <div className='cb-user-details-card'>
      <Text className='cb-user-details-header'>{headerDelete}</Text>
      <br />
      <br />
      <Text className='cb-user-details-text'>{textDelete}</Text>
      <br />
      <br />
      <Button
        className='cb-user-details-body-button-primary'
        onClick={() => void deleteAccount()}
      >
        <Text className='cb-user-details-subheader'>{buttonDelete}</Text>
      </Button>
    </div>
  );
};

export default UserDelete;
