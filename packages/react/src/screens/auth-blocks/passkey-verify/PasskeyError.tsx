import type { PasskeyVerifyBlock } from '@corbado/shared-ui';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Body, Header, HorizontalRule, PrimaryButton, SecondaryButton } from '../../../components';
import { FingerprintIcon } from '../../../components/ui/icons/Icons';

export const PasskeyError = ({ block }: { block: PasskeyVerifyBlock }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: `${block.authType}.passkey-verify.passkey-error`,
  });
  const [primaryLoading, setPrimaryLoading] = useState<boolean>(false);
  const [secondaryLoading, setSecondaryLoading] = useState<boolean>(false);

  const header = useMemo(() => t('header'), [t]);
  const body = useMemo(() => {
    return (
      <span>
        {t('body_errorMessage')}
        <span
          className='cb-link-primary'
          onClick={() => block.showPasskeyBenefits()}
        >
          {t('button_showPasskeyBenefits')}
        </span>
        {t(`body_tryAgainMessage`)}
      </span>
    );
  }, [t]);
  const primaryButton = useMemo(() => t('button_start'), [t]);
  const fallbacksAvailable = block.data.availableFallbacks.length > 0;

  const passkeyLogin = async () => {
    setPrimaryLoading(true);
    await block.passkeyLogin();
    setPrimaryLoading(false);
  };

  return (
    <div className='cb-layout-passkey'>
      <Header>{header}</Header>
      <Body className='cb-subheader-spacing'>{body}</Body>
      <FingerprintIcon className={'cb-finger-print-icon'} />
      <PrimaryButton
        onClick={() => void passkeyLogin()}
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