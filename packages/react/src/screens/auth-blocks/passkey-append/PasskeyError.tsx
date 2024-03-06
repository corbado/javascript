import { type PasskeyAppendBlock } from '@corbado/shared-ui';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Body, HorizontalRule } from '../../../components';
import { FingerprintIcon } from '../../../components/ui/icons/Icons';
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

  const passkeyAppend = async () => {
    setPrimaryLoading(true);
    await block.passkeyAppend();
    setPrimaryLoading(false);
  };

  return (
    <div className='new-ui-component'>
      <div className='cb-container-2'>
        <div className='cb-pk-error-bloc-2'>
          <Header>Something went wrong...</Header>
          <div className='cb-pk-error-bloc-icon-2'>
            <PasskeyErrorIcon />
          </div>
          <Text
            level='3'
            fontFamilyVariant='secondary'
            className='cb-pk-error-bloc-description-2'
          >
            Adding a passkey to your account was not possible. Please try again or use another method.
          </Text>
          <PrimaryButton
            onClick={() => void passkeyAppend()}
            isLoading={primaryLoading}
          >
            Try again
          </PrimaryButton>
          <Divider
            label='or'
            className='cb-pk-error-bloc-divider-2'
          />
          {block.data.availableFallbacks.map(fallback => (
            <SecondaryButton onClick={() => void fallback.action()}>{fallback.label}</SecondaryButton>
          ))}
          {block.data.canBeSkipped && (
            <SecondaryButton onClick={() => void block.skipPasskeyAppend()}>{t('button_skip')}</SecondaryButton>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className='cb-layout-passkey'>
      <Header>{header}</Header>
      <Body className='cb-subheader-spacing'>{body}</Body>
      <FingerprintIcon className={'cb-finger-print-icon'} />
      <PrimaryButton
        onClick={() => void passkeyAppend()}
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
          // isLoading={secondaryLoading}
          disabled={primaryLoading}
        >
          {fallback.label}
        </SecondaryButton>
      ))}
      {block.data.canBeSkipped && (
        <SecondaryButton
          onClick={() => void block.skipPasskeyAppend()}
          // isLoading={secondaryLoading}
          disabled={primaryLoading}
        >
          {t('button_skip')}
        </SecondaryButton>
      )}
    </div>
  );
};
