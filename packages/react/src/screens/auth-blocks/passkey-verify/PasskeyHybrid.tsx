import type { PasskeyVerifyBlock } from '@corbado/shared-ui';
import type { FC } from 'react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Divider, Header, PrimaryButton, SecondaryButton, Text } from '../../../components';
import PasskeyHybridIcon from '../../../components/ui/icons/PasskeyHybridIcon';

export interface PasskeyHybridProps {
  block: PasskeyVerifyBlock;
}

export const PasskeyHybrid: FC<PasskeyHybridProps> = ({ block }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: `login.passkey-verify.passkey-hybrid`,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [changingBlock, setChangingBlock] = useState<boolean>(false);

  const headerText = useMemo(() => t('header'), [t]);
  const bodyPromptText = useMemo(() => t('body_prompt'), [t]);
  const bodyPasskeyVerificationMethod1Text = useMemo(() => t('body_passkeyVerificationMethod1'), [t]);
  const bodyPasskeyVerificationMethod2Text = useMemo(() => t('body_passkeyVerificationMethod2'), [t]);
  const dividerText = useMemo(() => t('text_divider'), [t]);
  const loginButtonText = useMemo(() => t('button_login'), [t]);
  const fallbacksAvailable = block.data.availableFallbacks.length > 0;

  const passkeyLogin = useCallback(async () => {
    setLoading(true);

    await block.passkeyLogin();

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
        void passkeyLogin();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [passkeyLogin]);

  return (
    <div className='cb-pk-hybrid'>
      <Header>{headerText}</Header>
      <Text
        level='2'
        className='cb-pk-hybrid-prompt'
      >
        {bodyPromptText}
      </Text>
      <PasskeyHybridIcon className='cb-pk-hybrid-icon' />
      <div className='cb-pk-hybrid-verification-methods-section'>
        <Text level='2'>{bodyPasskeyVerificationMethod1Text}</Text>
        <Text level='2'>{bodyPasskeyVerificationMethod2Text}</Text>
      </div>
      <PrimaryButton
        onClick={() => void passkeyLogin()}
        isLoading={loading}
        disabled={changingBlock}
      >
        {loginButtonText}
      </PrimaryButton>
      {fallbacksAvailable && (
        <Divider
          label={dividerText}
          className='cb-pk-hybrid-divider'
        />
      )}
      {block.data.availableFallbacks.map(fallback => (
        <SecondaryButton
          key={fallback.label}
          disabled={changingBlock}
          onClick={() => {
            setChangingBlock(true);
            return void fallback.action();
          }}
        >
          {t(fallback.label)}
        </SecondaryButton>
      ))}
    </div>
  );
};
