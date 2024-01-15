import type { AppendPasskeyError } from '@corbado/web-core';
import type { FC } from 'react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Result } from 'ts-results';

import { Dialog, PrimaryButton } from '../';

export interface PasskeyCreateProps {
  handlerPasskeyCreate: () => Promise<Result<void, AppendPasskeyError | undefined>>;
}

const PasskeyCreate: FC<PasskeyCreateProps> = ({ handlerPasskeyCreate }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'passkeysList' });
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const createPasskey = async () => {
    setLoading(true);
    const result = await handlerPasskeyCreate();
    setLoading(false);

    if (result.err && result.val?.name === 'errors.passkeyAlreadyExists') {
      openDialog();
    }
  };

  return (
    <div>
      <PrimaryButton
        className={'cb-passkey-list-primary-button'}
        isLoading={loading}
        onClick={() => void createPasskey()}
      >
        {t('button_createPasskey')}
      </PrimaryButton>
      <Dialog
        isOpen={isDialogOpen}
        header={t('dialog_passkeyAlreadyExists.header')}
        body={t('dialog_passkeyAlreadyExists.body')}
        confirmText={t('dialog_passkeyAlreadyExists.button_confirm')}
        onClose={closeDialog}
        onConfirm={closeDialog}
      />
    </div>
  );
};

export default PasskeyCreate;
