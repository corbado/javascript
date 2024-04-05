import type { ConfirmProcessAbortBlock } from '@corbado/shared-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Header, PrimaryButton, SecondaryButton, Text } from '../../../components';
import { FirstPageIcon } from '../../../components/ui/icons/FirstPageIcon';

export const ConfirmProcessAbort = ({ block }: { block: ConfirmProcessAbortBlock }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'errors.confirm_process_abort' });

  return (
    <div className='cb-confirm-process-abort'>
      <Header size='lg'>{t('header')}</Header>
      <div className='cb-confirm-process-abort-container'>
        <FirstPageIcon className='cb-confirm-process-abort-icon' />
      </div>
      <Text
        level='2'
        fontFamilyVariant='secondary'
      >
        {t('subheader')}
      </Text>
      <PrimaryButton onClick={() => void block.confirmAbort()}>{t('confirm')}</PrimaryButton>
      <SecondaryButton onClick={() => block.cancelAbort(block.data)}>{t('back')}</SecondaryButton>
    </div>
  );
};
