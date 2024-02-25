import type { PasskeyVerifyBlock } from '@corbado/shared-ui';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Header, HorizontalRule, SecondaryButton, SubHeader } from '../../../components';
import { FingerprintIcon } from '../../../components/ui/icons/Icons';

export const PasskeyBackground = ({ block }: { block: PasskeyVerifyBlock }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: `login.passkey-verify.passkey-background`,
  });
  const [passkeyName, setPasskeyName] = useState<string | undefined>(undefined);
  const [secondaryLoading, setSecondaryLoading] = useState<boolean>(false);
  const passkeyLoginStarted = useRef(false);

  useEffect(() => {
    setPasskeyName(block.data.userHandle);

    setSecondaryLoading(false);
  }, [block]);

  useEffect(() => {
    if (passkeyLoginStarted.current) {
      return;
    }

    passkeyLoginStarted.current = true;
    void block.passkeyLogin();
  }, []);

  const header = useMemo(() => <span>{t('header')}</span>, [t]);

  const subHeader = useMemo(() => <span className='cb-text-secondary'>{passkeyName}</span>, [t, passkeyName]);

  const fallbacksAvailable = block.data.availableFallbacks.length > 0;

  return (
    <div className='cb-layout-passkey'>
      <Header>{header}</Header>
      <SubHeader className='cb-subheader-spacing'>{subHeader}</SubHeader>
      <FingerprintIcon className={'cb-finger-print-icon'} />
      {fallbacksAvailable && <HorizontalRule>or</HorizontalRule>}
      {block.data.availableFallbacks.map(fallback => (
        <SecondaryButton
          key={fallback.label}
          onClick={() => {
            setSecondaryLoading(true);
            void fallback.action();
          }}
          isLoading={secondaryLoading}
        >
          {fallback.label}
        </SecondaryButton>
      ))}
    </div>
  );
};
