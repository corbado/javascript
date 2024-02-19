import { type PasskeyAppendBlock } from '@corbado/shared-ui';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Header, HorizontalRule, PrimaryButton, SecondaryButton, SubHeader } from '../../../components';
import { FingerprintIcon } from '../../../components/ui/icons/Icons';

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
  const fallbacksAvailable = block.data.availableFallbacks.length > 0;

  return (
    <div className='cb-layout-passkey'>
      <Header>{header}</Header>
      <SubHeader className='cb-subheader-spacing'>{subHeader}</SubHeader>
      <FingerprintIcon className={'cb-finger-print-icon'} />
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
      {fallbacksAvailable && <HorizontalRule>or</HorizontalRule>}
      {block.data.availableFallbacks.map(fallback => (
        <SecondaryButton
          onClick={() => {
            setSecondaryLoading(true);
            return fallback.action();
          }}
          isLoading={secondaryLoading}
          disabled={primaryLoading}
        >
          {fallback.label}
        </SecondaryButton>
      ))}
      {block.data.canBeSkipped && (
        <SecondaryButton
          onClick={() => block.skipPasskeyAppend()}
          isLoading={secondaryLoading}
          disabled={primaryLoading}
        >
          {t('button_skip')}
        </SecondaryButton>
      )}
    </div>
  );
};
