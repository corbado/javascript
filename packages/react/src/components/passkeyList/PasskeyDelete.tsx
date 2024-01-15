import type { FC } from 'react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '..';
import { DeleteIcon } from '../ui/icons/Icons';

export interface PasskeyDeleteProps {
  passkeyId: string;
  onPasskeyDelete: (id: string) => Promise<void>;
}

const PasskeyDelete: FC<PasskeyDeleteProps> = ({ passkeyId, onPasskeyDelete }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'passkeysList.dialog_delete' });
  const [isDialogOpen, setDialogOpen] = useState(false);

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const confirmDelete = async () => {
    await onPasskeyDelete(passkeyId);
    closeDialog();
  };

  return (
    <div className='cb-passkey-list-icon'>
      <DeleteIcon onClick={openDialog} />
      <Dialog
        isOpen={isDialogOpen}
        header={t('header')}
        body={t('body')}
        confirmText={t('button_confirm')}
        cancelText={t('button_cancel')}
        onClose={closeDialog}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default PasskeyDelete;
