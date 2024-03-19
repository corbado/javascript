import type { PasskeyAppendedBlock } from '@corbado/shared-ui';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PrimaryButton } from '../../../components/ui2/buttons/PrimaryButton';
import { PasskeyAppendedIcon } from '../../../components/ui2/icons/PasskeyAppendedIcon';
import { Header } from '../../../components/ui2/typography/Header';
import { Text } from '../../../components/ui2/typography/Text';

export const PasskeyAppended = ({ block }: { block: PasskeyAppendedBlock }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: `signup.passkey-appended.passkey-appended`,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const headerText = useMemo(() => t('header'), [t]);
  const subHeaderText = useMemo(() => t('subheader'), [t]);
  const bodyText = useMemo(() => t('body'), [t]);
  const primaryButtonText = useMemo(() => t('button'), [t]);

  return (
    <div className='cb-pk-appended-bloc'>
      <Header>{headerText}</Header>
      <div className='cb-pk-appended-bloc-icon'>
        <PasskeyAppendedIcon />
      </div>
      <Text
        level='3'
        fontWeight='bold'
      >
        {subHeaderText}
      </Text>
      <Text
        level='2'
        fontFamilyVariant='secondary'
        className='cb-pk-appended-bloc-description'
      >
        {bodyText}
      </Text>
      <PrimaryButton
        onClick={() => {
          setLoading(true);
          return void block.continue();
        }}
        isLoading={loading}
      >
        {primaryButtonText}
      </PrimaryButton>
    </div>
  );
};
