import { type PasskeyAppendBlock } from '@corbado/shared-ui';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Header, PrimaryButton, SubHeader } from '../../../components';

export const PasskeyAppend = ({ block }: { block: PasskeyAppendBlock }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: `authentication.passkey-append.passkey-append`,
  });
  const [passkeyUserHandle, setPasskeyUserHandle] = useState<string | undefined>(undefined);
  const [primaryLoading, setPrimaryLoading] = useState<boolean>(false);
  const [secondaryLoading, setSecondaryLoading] = useState<boolean>(false);

  useEffect(() => {
    setPasskeyUserHandle(block.data.userHandle);

    setPrimaryLoading(false);
    setSecondaryLoading(false);
  }, [block]);

  const header = useMemo(
    () => (
      <Header>
        <span>
          {t('header')}
          <span
            className='cb-link-primary'
            onClick={() => void block.showPasskeyBenefits()}
          >
            {t('headerButton_showPasskeyBenefits')}
          </span>
        </span>
      </Header>
    ),
    [t],
  );

  const subHeader = useMemo(
    () => (
      <span>
        {t('body')} <span className='cb-text-secondary'>{passkeyUserHandle}</span>.
      </span>
    ),
    [t, passkeyUserHandle],
  );

  const primaryButton = useMemo(() => t('button_start'), [t]);

  return (
    <div className='cb-layout-passkey'>
      <Header>{header}</Header>
      {subHeader && <SubHeader className='cb-subheader-spacing'>{subHeader}</SubHeader>}
      <PrimaryButton
        onClick={() => {
          setPrimaryLoading(true);
          return block.passkeyAppend();
        }}
        isLoading={primaryLoading}
        disabled={secondaryLoading}
      >
        {primaryButton}
      </PrimaryButton>
    </div>
  );
};
