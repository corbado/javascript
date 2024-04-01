import { useCorbado } from '@corbado/react-sdk';
import type { FC } from 'react';
import React, { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PrimaryButton } from '../ui2/buttons/PrimaryButton';
import { Dialog } from '../ui2/Dialog';

export interface PasskeyCreateProps {
  fetchPasskeys: () => Promise<void>;
}

export const PasskeyCreate: FC<PasskeyCreateProps> = memo(({ fetchPasskeys }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'passkey-list' });
  const { corbadoApp } = useCorbado();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const translatedTexts = useMemo(
    () => ({
      buttonText: t('button_createPasskey'),
      dialogHeader: t('dialog_passkeyAlreadyExists.header'),
      dialogBody: t('dialog_passkeyAlreadyExists.body'),
      dialogConfirmText: t('dialog_passkeyAlreadyExists.button_confirm'),
    }),
    [t],
  );

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const createPasskey = async () => {
    setLoading(true);
    const result = await corbadoApp?.authProcessService.appendPasskey();

    if (result?.ok) {
      await fetchPasskeys();
    } else if (result?.val?.name === 'errors.passkeyAlreadyExists') {
      openDialog();
    }

    setLoading(false);
  };

  return (
    <div>
      <PrimaryButton
        className='cb-passkey-list-primary-button'
        isLoading={loading}
        onClick={() => void createPasskey()}
      >
        {translatedTexts.buttonText}
      </PrimaryButton>
      <Dialog
        isOpen={isDialogOpen}
        header={translatedTexts.dialogHeader}
        body={translatedTexts.dialogBody}
        confirmText={translatedTexts.dialogConfirmText}
        onClose={closeDialog}
        onConfirm={closeDialog}
      />
    </div>
  );
});
