import { t } from 'i18next';
import React, { useMemo, useState } from 'react';

import { Button, Text } from '../../components';
import { useCorbado } from '../../hooks/useCorbado';
import UserDetailsCard from '../../components/user-details/UserDetailsCard';
import Alert from '../../components/user-details/Alert';

const UserDelete = () => {
  const { deleteUser, logout } = useCorbado();

  const [isDeleting, setIsDeleting] = useState(false);

  const headerDelete = useMemo(() => t('user-details.delete_account'), [t]);
  const buttonDelete = useMemo(() => t('user-details.delete'), [t]);
  const textDelete = useMemo(() => t('user-details.delete_account_text'), [t]);
  const titleDelete = useMemo(() => t('user-details.delete_account_title'), [t]);
  const cancelDelete = useMemo(() => t('user-details.cancel'), [t]);
  const confirmDelete = useMemo(() => t('user-details.confirm'), [t]);

  const deleteAccount = async () => {
    const res = await deleteUser();
    if (res.err) {
      // no possible error code
      console.error(res.val.message);
      return;
    }

    void logout();
  };

  return (
    <UserDetailsCard header={headerDelete}>
      <Text className='cb-user-details-body-subtitle cb-bold-text-weight cb-text-4'>{titleDelete}</Text>
      <Text className='cb-user-details-text'>{textDelete}</Text>
      {!isDeleting ? (
        <Button
          className='cb-user-details-body-button-delete'
          onClick={() => setIsDeleting(true)}
        >
          <Text className='cb-user-details-subheader cb-error-text-color'>{buttonDelete}</Text>
        </Button>
      ) : (
        <>
          <Alert text={t('user-details.delete_account_alert')} />

          <div className='cb-user-details-body-row'>
            <Button
              className='cb-user-details-body-button-delete'
              onClick={() => void deleteAccount()}
            >
              <Text className='cb-user-details-subheader cb-error-text-color'>{confirmDelete}</Text>
            </Button>

            <Button
              className='cb-user-details-body-button-secondary'
              onClick={() => setIsDeleting(false)}
            >
              <Text className='cb-user-details-subheader cb-secondary-text-color'>{cancelDelete}</Text>
            </Button>
          </div>
        </>
      )}
    </UserDetailsCard>
  );
};

export default UserDelete;
