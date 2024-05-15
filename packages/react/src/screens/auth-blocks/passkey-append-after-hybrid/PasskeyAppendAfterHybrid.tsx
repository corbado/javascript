import type { PasskeyAppendAfterHybridBlock } from '@corbado/shared-ui';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Header, PrimaryButton, SecondaryButton, Text } from '../../../components';
import { PasskeyAppendAfterHybridIcon } from '../../../components/ui/icons/PasskeyAppendAfterHybridIcon';

export const PasskeyAppendAfterHybrid = ({ block }: { block: PasskeyAppendAfterHybridBlock }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: `signup.passkey-append-after-hybrid.passkey-append-after-hybrid`,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const headerText = useMemo(() => t('header'), [t]);
  const bodyText = useMemo(() => t('body'), [t]);
  //   const dontShowAgainText = useMemo(() => t('text_dontShowAgain'), [t]);
  const primaryButtonText = useMemo(() => t('button_appendPasskey'), [t]);
  const secondaryButtonText = useMemo(() => t('button_continue'), [t]);

  const handleContinue = useCallback(() => {
    setLoading(true);
    return void block.passkeyAppend();
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

  return (
    <div className='cb-pk-appended-bloc'>
      <Header>{headerText}</Header>
      <div className='cb-pk-appended-bloc-icon'>
        <PasskeyAppendAfterHybridIcon />
      </div>
      <Text
        level='2'
        fontFamilyVariant='secondary'
        className='cb-pk-appended-bloc-description'
      >
        {bodyText}
      </Text>
      <PrimaryButton
        onClick={handleContinue}
        isLoading={loading}
      >
        {primaryButtonText}
      </PrimaryButton>
      <div className='cb-pk-append-skip-button-section'>
        <SecondaryButton
          onClick={() => void block.data.preferredFallbackOnSkip?.action()}
          disabled={loading}
        >
          {secondaryButtonText}
        </SecondaryButton>
      </div>
    </div>
  );
};
