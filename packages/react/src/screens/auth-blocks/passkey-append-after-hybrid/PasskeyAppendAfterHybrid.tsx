import type { PasskeyAppendBlock } from '@corbado/shared-ui';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Checkbox, Header, PrimaryButton, SecondaryButton, Text } from '../../../components';
import { LockIcon } from '../../../components/ui/icons/LockIcon';
import { PasskeyAppendAfterHybridIcon } from '../../../components/ui/icons/PasskeyAppendAfterHybridIcon';

export const PasskeyAppendAfterHybrid = ({ block }: { block: PasskeyAppendBlock }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: `${block.authType}.passkey-append-after-hybrid.passkey-append-after-hybrid`,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [dontShowAgainChecked, setDontShowAgainChecked] = useState<boolean>(false);

  const headerText = useMemo(() => t('header'), [t]);
  const bodyText = useMemo(() => t('body'), [t]);
  const dontShowAgainText = useMemo(() => t('text_dontShowAgain'), [t]);
  const primaryButtonText = useMemo(() => t('button_appendPasskey'), [t]);
  const secondaryButtonText = useMemo(() => t('button_continue'), [t]);

  const handleContinue = useCallback(async () => {
    setLoading(true);

    if (dontShowAgainChecked) {
      await block.skipFutureAppendAfterHybrid();
    }

    await block.passkeyAppend();
  }, [block]);

  const handleSkip = useCallback(() => {
    if (dontShowAgainChecked) {
      void block.skipFutureAppendAfterHybrid();
    }

    void block.skipPasskeyAppend();
  }, [block]);

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

  const handleDontShowAgainChange = useCallback(() => {
    setDontShowAgainChecked(!dontShowAgainChecked);
  }, [dontShowAgainChecked]);

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
      <Checkbox
        label={dontShowAgainText}
        checked={dontShowAgainChecked}
        onChange={handleDontShowAgainChange}
      />
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
