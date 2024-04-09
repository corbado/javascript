import type { PasskeyVerifyBlock } from '@corbado/shared-ui';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import { SecondaryButton } from '../../../components/ui/buttons/SecondaryButton';
import { Divider } from '../../../components/ui/Divider';
import { PasskeyErrorIcon } from '../../../components/ui/icons/PasskeyErrorIcon';
import { PersonIcon } from '../../../components/ui/icons/PersonIcon';
import { Header } from '../../../components/ui/typography/Header';
import { Text } from '../../../components/ui/typography/Text';
import { UserInfo } from '../../../components/ui/UserInfo';

export const PasskeyError = ({ block }: { block: PasskeyVerifyBlock }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: `login.passkey-verify.passkey-error`,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<string>(block.data.identifierValue);

  const headerText = useMemo(() => t('header'), [t]);
  const bodyTitleText = useMemo(() => t('body_title'), [t]);
  const bodyDescriptionText = useMemo(() => t('body_description'), [t]);
  const dividerText = useMemo(() => t('text_divider'), [t]);
  const primaryButtonText = useMemo(() => t('button_tryAgain'), [t]);

  const fallbacksAvailable = block.data.availableFallbacks.length > 0;

  const passkeyLogin = useCallback(async () => {
    setLoading(true);
    await block.passkeyLogin();
    setLoading(false);
  }, [block]);

  useEffect(() => {
    setUserInfo(block.getFormattedPhoneNumber());
  }, [block]);

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

  async function userInfoChange() {
    setLoading(true);
    await block.confirmAbort();
    setLoading(false);
  }

  return (
    <div className='cb-pk-error-bloc'>
      <Header>{headerText}</Header>
      <div className='cb-pk-error-bloc-icon'>
        <PasskeyErrorIcon />
      </div>
      <div className='cb-pk-error-user-info-edit-section'>
        <Text
          level='2'
          fontWeight='bold'
          className='cb-pk-error-user-info-edit-section-title'
        >
          {bodyTitleText}
        </Text>
        <UserInfo
          userData={userInfo}
          leftIcon={<PersonIcon className='cb-user-info-section-left-icon' />}
          onRightIconClick={() => void userInfoChange()}
        ></UserInfo>
      </div>
      <Text
        level='2'
        fontFamilyVariant='secondary'
        className='cb-pk-error-bloc-description'
      >
        {bodyDescriptionText}
      </Text>
      <PrimaryButton
        onClick={() => void passkeyLogin()}
        isLoading={loading}
      >
        {primaryButtonText}
      </PrimaryButton>
      {fallbacksAvailable && (
        <Divider
          label={dividerText}
          className='cb-pk-error-bloc-divider'
        />
      )}
      {block.data.availableFallbacks.map(fallback => (
        <SecondaryButton
          key={fallback.label}
          disabled={loading}
          onClick={() => {
            setLoading(true);
            return void fallback.action();
          }}
        >
          {t(fallback.label)}
        </SecondaryButton>
      ))}
    </div>
  );
};
