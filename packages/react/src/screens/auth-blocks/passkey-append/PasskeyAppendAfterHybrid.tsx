import type { PasskeyAppendBlock } from '@corbado/shared-ui';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Header, PrimaryButton, SecondaryButton, Text } from '../../../components';
import { LockIcon } from '../../../components/ui/icons/LockIcon';
import { PasskeyAppendAfterHybridIcon } from '../../../components/ui/icons/PasskeyAppendAfterHybridIcon';
import { useTelemetry } from '../../../hooks/useTelemetry';

export const PasskeyAppendAfterHybrid = ({ block }: { block: PasskeyAppendBlock }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: `signup.passkey-append.passkey-append-after-hybrid`,
  });

  const { logMethodCalled } = useTelemetry();

  const [loading, setLoading] = useState<boolean>(false);

  const headerText = useMemo(() => t('header'), [t]);
  const bodyText = useMemo(() => t('body'), [t]);
  const primaryButtonText = useMemo(() => t('button_appendPasskey'), [t]);
  const secondaryButtonText = useMemo(() => t('button_continue'), [t]);

  const handleContinue = useCallback(async () => {
    setLoading(true);

    logMethodCalled('passkeyAppend', 'PasskeyAppendAfterHybrid');

    await block.passkeyAppend();
  }, [block, logMethodCalled]);

  const handleSkip = useCallback(() => {
    logMethodCalled('skipPasskeyAppend', 'PasskeyAppendAfterHybrid');

    void block.skipPasskeyAppend();
  }, [block, logMethodCalled]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        void handleContinue();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleContinue]);

  return (
    <div className='cb-pk-append-after-hybrid'>
      <Header>{headerText}</Header>
      <div className='cb-pk-append-after-hybrid-icon'>
        <PasskeyAppendAfterHybridIcon />
      </div>
      <div className='cb-pk-append-after-hybrid-description'>
        <LockIcon className='cb-pk-append-after-hybrid-description-icon' />
        <Text
          level='2'
          fontFamilyVariant='secondary'
        >
          {bodyText}
        </Text>
      </div>
      <PrimaryButton
        onClick={() => void handleContinue()}
        isLoading={loading}
      >
        {primaryButtonText}
      </PrimaryButton>
      <div className='cb-pk-append-after-hybrid-button'>
        <SecondaryButton
          onClick={handleSkip}
          disabled={loading}
        >
          {secondaryButtonText}
        </SecondaryButton>
      </div>
    </div>
  );
};
