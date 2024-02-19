import type { PasskeyAppendedBlock } from '@corbado/shared-ui';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Body, Header, PrimaryButton } from '../../../components';

export const PasskeyAppended = ({ block }: { block: PasskeyAppendedBlock }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: `authentication.passkey-appended.passkey-appended`,
  });
  const header = useMemo(() => t('header'), [t]);
  const secondaryHeader = useMemo(() => t('subheader'), [t]);
  const body = useMemo(
    () => (
      <span>
        {t('body_text1')} <strong>{t(`body_text2.emailOtp`)}</strong> {t('body_text3')}
      </span>
    ),
    [t],
  );

  const primaryButton = useMemo(() => t('button'), [t]);

  return (
    <div className='cb-layout-passkey'>
      <Header>{header}</Header>
      <Header className='cb-secondary-header-spacing'>{secondaryHeader}</Header>
      <Body className='cb-body-spacing'>{body}</Body>
      <PrimaryButton
        onClick={() => {
          return block.continue();
        }}
      >
        {primaryButton}
      </PrimaryButton>
    </div>
  );
};
