import { LoginIdentifierType, type LoginInitBlock } from '@corbado/shared-ui';
import type { FC } from 'react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { LoadingSpinner, SecondaryButton, Text } from '../../ui';
import { PasskeyDefaultIcon } from '../../ui/icons/PasskeyDefaultIcon';
import { RightIcon } from '../../ui/icons/RightIcon';

export interface LastIdentifierProps {
  block: LoginInitBlock;
  socialLoadingInProgress: boolean | undefined;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  switchToLoginForm: () => void;
}

export const LastIdentifier: FC<LastIdentifierProps> = ({
  block,
  socialLoadingInProgress,
  loading,
  setLoading,
  switchToLoginForm,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: `login.login-init.login-init.last_identifier` });

  const title = useMemo(() => t('title'), [t]);
  const skipText = useMemo(() => t('text_skip'), [t]);
  const skipButtonText = useMemo(() => t('button_skip'), [t]);

  const login = () => {
    if (socialLoadingInProgress) {
      return;
    }

    setLoading(true);

    const lastIdentifier = block.data.lastIdentifier;

    if (!lastIdentifier) {
      return;
    }

    block
      .start(lastIdentifier.value, lastIdentifier.type === LoginIdentifierType.Phone)
      .finally(() => setLoading(false));
  };

  return (
    <>
      <div
        className={`cb-last-identifier ${socialLoadingInProgress ? 'cb-last-identifier-disabled' : ''}`}
        onClick={login}
      >
        <div className='cb-last-identifier-icon'>
          <PasskeyDefaultIcon />
        </div>
        <div className='cb-last-identifier-details'>
          <Text
            level='2'
            fontFamilyVariant='secondary'
            fontWeight='bold'
          >
            {title}
          </Text>
          <Text
            level='2'
            fontFamilyVariant='secondary'
            textColorVariant='secondary'
          >
            {block.data.lastIdentifier?.value}
          </Text>
        </div>
        {loading ? (
          <LoadingSpinner className='cb-last-identifier-spinner' />
        ) : (
          <div className='cb-last-identifier-icon'>
            <RightIcon />
          </div>
        )}
      </div>
      <Text
        level='2'
        fontWeight='normal'
        textColorVariant='script'
        className='cb-last-identifier-skip-button'
      >
        {skipText}
        <SecondaryButton
          colorVariant='link'
          disabled={loading}
          onClick={switchToLoginForm}
        >
          {skipButtonText}
        </SecondaryButton>
      </Text>
    </>
  );
};
