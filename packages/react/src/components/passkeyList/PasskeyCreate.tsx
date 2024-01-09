import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Dialog } from '../';

export interface PasskeyCreateProps {
  handlerPasskeyCreate: () => Promise<void>;
  passkeyCreateError?: string;
  clearPasskeyCreateError: () => void;
}

const PasskeyCreate: FC<PasskeyCreateProps> = ({
  passkeyCreateError,
  handlerPasskeyCreate,
  clearPasskeyCreateError,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'passkeysList' });
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (passkeyCreateError === 'errors.passkeyAlreadyExists') {
      openDialog();
    }
  }, [passkeyCreateError]);

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    clearPasskeyCreateError();
  };

  const createPasskey = async () => {
    setLoading(true);
    await handlerPasskeyCreate();
    setLoading(false);
  };

  return (
    <div>
      <Button
        variant='primary'
        className='cb-passkey-list-primary-button'
        isLoading={loading}
        disabled={loading}
        onClick={() => void createPasskey()}
      >
        {t('button_createPasskey')}
      </Button>
      <Dialog
        isOpen={isDialogOpen}
        header={t('dialogHeader_passkeyAlreadyExists')}
        body={t('dialogBody_passkeyAlreadyExists')}
        confirmText={t('dialogConfirmButton_passkeyAlreadyExists')}
        onClose={closeDialog}
        onConfirm={closeDialog}
      />
    </div>
  );
};

export default PasskeyCreate;
