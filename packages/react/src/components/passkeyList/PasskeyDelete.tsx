import type { FC } from 'react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '..';

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
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        className='cb-passkey-list-delete'
        onClick={openDialog}
      >
        <path d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z' />
      </svg>
      <Dialog
        inverseButtonVariants
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
