import type { ConfirmProcessAbortBlock } from '@corbado/shared-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { PrimaryButton } from '../../../components/ui2/buttons/PrimaryButton';
import { SecondaryButton } from '../../../components/ui2/buttons/SecondaryButton';
import { FirstPageIcon } from '../../../components/ui2/icons/FirstPageIcon';
import { Header } from '../../../components/ui2/typography/Header';
import { Text } from '../../../components/ui2/typography/Text';

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
