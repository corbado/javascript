import { type PasskeyAppendBlock } from '@corbado/shared-ui';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Body, Header, HorizontalRule, PrimaryButton, SecondaryButton } from '../../../components';
import { FingerprintIcon } from '../../../components/ui/icons/Icons';

export const PasskeyBenefits = ({ block }: { block: PasskeyAppendBlock }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: `signup.passkey-append.passkey-benefits`,
  });
  const [primaryLoading, setPrimaryLoading] = useState<boolean>(false);
  const [secondaryLoading, setSecondaryLoading] = useState<boolean>(false);

  const header = useMemo(() => t('header'), [t]);
  const body = useMemo(
    () => (
      <>
        {t('body_introduction')} <strong>{t('body_loginMethods')}</strong>
      </>
    ),
    [t],
  );

  const primaryButton = useMemo(() => t('button_start'), [t]);
  const fallbacksAvailable = block.data.availableFallbacks.length > 0;

  return (
    <div className='cb-layout-passkey'>
      <Header>{header}</Header>
      <FingerprintIcon className={'cb-finger-print-icon'} />
      <Body className='cb-body-spacing'>{body}</Body>
      <PrimaryButton
        onClick={() => {
          setPrimaryLoading(true);
          return block.passkeyAppend();
        }}
        isLoading={primaryLoading}
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
