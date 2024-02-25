import type { PasskeyFallback, PasskeyVerifyBlock } from '@corbado/shared-ui';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Body, Header, HorizontalRule, PrimaryButton, SecondaryButton } from '../../../components';
import { FingerprintIcon } from '../../../components/ui/icons/Icons';

export const PasskeyBenefits = ({ block }: { block: PasskeyVerifyBlock }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: `${block.authType}.passkey-verify.passkey-benefits`,
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
          return block.passkeyLogin();
        }}
        isLoading={primaryLoading}
      >
        {primaryButton}
      </PrimaryButton>
      {fallbacksAvailable && <HorizontalRule>or</HorizontalRule>}
      {block.data.availableFallbacks.map((fallback: PasskeyFallback) => (
        <SecondaryButton
          onClick={() => {
            setSecondaryLoading(true);
            void fallback.action();
          }}
          isLoading={secondaryLoading}
          disabled={primaryLoading}
        >
          {fallback.label}
        </SecondaryButton>
      ))}
    </div>
  );
};
