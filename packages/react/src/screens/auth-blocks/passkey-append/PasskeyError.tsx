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
  const skipButtonText = useMemo(() => t('button_skip'), [t]);

  const passkeyAppend = async () => {
    setLoading(true);
    await block.passkeyAppend();
    setLoading(false);
  };

  return (
    <div className='new-ui-component'>
      <div className='cb-container-2'>
        <div className='cb-pk-error-bloc-2'>
          <Header>{headerText}</Header>
          <div className='cb-pk-error-bloc-icon-2'>
            <PasskeyErrorIcon />
          </div>
          <Text
            level='3'
            fontFamilyVariant='secondary'
            className='cb-pk-error-bloc-description-2'
          >
            {bodyText}
          </Text>
          <PrimaryButton
            onClick={() => void passkeyAppend()}
            isLoading={loading}
          >
            {primaryButtonText}
          </PrimaryButton>
          <Divider
            label='or'
            className='cb-pk-error-bloc-divider-2'
          />
          {block.data.availableFallbacks.map(fallback => (
            <SecondaryButton
              disabled={loading}
              onClick={() => void fallback.action()}
            >
              {t(fallback.label)}
            </SecondaryButton>
          ))}
          {block.data.canBeSkipped && (
            <SecondaryButton
              disabled={loading}
              onClick={() => void block.skipPasskeyAppend()}
            >
              {skipButtonText}
            </SecondaryButton>
          )}
        </div>
      </div>
    </div>
  );
};
