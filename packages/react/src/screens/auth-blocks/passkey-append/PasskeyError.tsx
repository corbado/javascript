import { type PasskeyAppendBlock } from '@corbado/shared-ui';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import { SecondaryButton } from '../../../components/ui/buttons/SecondaryButton';
import { Divider } from '../../../components/ui/Divider';
import { PasskeyErrorIcon } from '../../../components/ui/icons/PasskeyErrorIcon';
import { Header } from '../../../components/ui/typography/Header';
import { Text } from '../../../components/ui/typography/Text';

export const PasskeyError = ({ block }: { block: PasskeyAppendBlock }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: `signup.passkey-append.passkey-error`,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [changingBlock, setChangingBlock] = useState<boolean>(false);

  const headerText = useMemo(() => t('header'), [t]);
  const bodyText = useMemo(() => t('body'), [t]);
  const skipButtonText = useMemo(() => t('button_cancel'), [t]);
  const dividerLabel = useMemo(() => t('text_divider'), [t]);
  const tryAgainButtonText = useMemo(() => t('button_tryAgain'), [t]);
  const fallbackButtonText = useMemo(
    () => t(block.data.preferredFallbackOnError?.label ?? ''),
    [t, block.data.preferredFallbackOnError],
  );

  const signup = useCallback(async () => {
    setLoading(true);

    if (block.data.preferredFallbackOnError) {
      setChangingBlock(true);
      await block.data.preferredFallbackOnError.action();
    } else {
      await block.passkeyAppend();
    }

    setLoading(false);
  }, [block]);

  useEffect(() => {
    return () => {
      block.cancelPasskeyOperation();
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        void signup();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [signup]);

  async function tryAgain() {
    setLoading(true);
    await block.passkeyAppend();
    setLoading(false);
  }

  const showDivider = !block.data.canBeSkipped && !!block.data.preferredFallbackOnError;

  return (
    <div className='cb-pk-error-bloc'>
      <Header>{headerText}</Header>
      <div className='cb-pk-error-bloc-icon'>
        <PasskeyErrorIcon />
      </div>
      <Text
        level='2'
        fontFamilyVariant='secondary'
        className='cb-pk-error-bloc-description'
      >
        {bodyText}
      </Text>
      <PrimaryButton
        onClick={() => void signup()}
        isLoading={loading}
        disabled={changingBlock}
      >
        {block.data.preferredFallbackOnError ? fallbackButtonText : tryAgainButtonText}
      </PrimaryButton>
      {showDivider && (
        <>
          <Divider
            label={dividerLabel}
            className='cb-pk-error-bloc-divider'
          />
          <SecondaryButton
            disabled={changingBlock}
            onClick={() => void tryAgain()}
          >
            {tryAgainButtonText}
          </SecondaryButton>
        </>
      )}
      {block.data.canBeSkipped && (
        <SecondaryButton
          className='cb-pk-error-bloc-skip-button'
          disabled={changingBlock}
          onClick={() => {
            setChangingBlock(true);
            void block.skipPasskeyAppend();
          }}
        >
          {skipButtonText}
        </SecondaryButton>
      )}
    </div>
  );
};
