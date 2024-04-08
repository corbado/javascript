import type { FC } from 'react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '../ui/Dialog';
import { DeleteIcon } from '../ui/icons/DeleteIcon';

export interface PasskeyDeleteProps {
  passkeyId: string;
  onPasskeyDelete: (id: string) => Promise<void>;
}

export const PasskeyDelete: FC<PasskeyDeleteProps> = ({ passkeyId, onPasskeyDelete }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'passkey-list.dialog_delete' });
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
      <DeleteIcon
        className='cb-passkey-list-delete'
        onClick={openDialog}
      />
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
