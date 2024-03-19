import { type PasskeyAppendBlock } from '@corbado/shared-ui';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PrimaryButton } from '../../../components/ui2/buttons/PrimaryButton';
import { SecondaryButton } from '../../../components/ui2/buttons/SecondaryButton';
import { Divider } from '../../../components/ui2/Divider';
import { PasskeyErrorIcon } from '../../../components/ui2/icons/PasskeyErrorIcon';
import { Header } from '../../../components/ui2/typography/Header';
import { Text } from '../../../components/ui2/typography/Text';

export const PasskeyError = ({ block }: { block: PasskeyAppendBlock }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: `signup.passkey-append.passkey-error`,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const headerText = useMemo(() => t('header'), [t]);
  const bodyText = useMemo(() => t('body'), [t]);
  const primaryButtonText = useMemo(() => t('button_tryAgain'), [t]);
  const skipButtonText = useMemo(() => t('button_cancel'), [t]);
  const dividerLabel = useMemo(() => t('text_divider'), [t]);

  const passkeyAppend = async () => {
    setLoading(true);
    await block.passkeyAppend();
    setLoading(false);
  };

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
        onClick={() => void passkeyAppend()}
        isLoading={loading}
      >
        {primaryButtonText}
      </PrimaryButton>
      {!block.data.canBeSkipped && (
        <Divider
          label={dividerLabel}
          className='cb-pk-error-bloc-divider'
        />
      )}
      {block.data.availableFallbacks.map(fallback => (
        <SecondaryButton
          key={fallback.label}
          disabled={loading}
          onClick={() => void fallback.action()}
        >
          {t(fallback.label)}
        </SecondaryButton>
      ))}
      {block.data.canBeSkipped && (
        <SecondaryButton
          className='cb-pk-error-bloc-skip-button'
          disabled={loading}
          onClick={() => void block.skipPasskeyAppend()}
        >
          {skipButtonText}
        </SecondaryButton>
      )}
    </div>
  );
};
