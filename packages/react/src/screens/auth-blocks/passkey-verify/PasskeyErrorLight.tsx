import type { PasskeyVerifyBlock } from '@corbado/shared-ui';
import type { FC } from 'react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Divider, Header, PrimaryButton, SecondaryButton, Text, UserInfo } from '../../../components';
import { FaceIdIcon } from '../../../components/ui/icons/FaceIdIcon';
import { FingerPrintIcon } from '../../../components/ui/icons/FingerPrintIcon';
import { PersonIcon } from '../../../components/ui/icons/PersonIcon';

export interface PasskeyErrorProps {
  block: PasskeyVerifyBlock;
}

export const PasskeyErrorLight: FC<PasskeyErrorProps> = ({ block }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: `login.passkey-verify.passkey-error-light`,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [changingBlock, setChangingBlock] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<string>(block.data.identifierValue);

  const headerText = useMemo(() => t('header'), [t]);
  const bodyTitleText = useMemo(() => t('body_title'), [t]);
  const bodyDescriptionText = useMemo(() => t('body_description'), [t]);
  const dividerText = useMemo(() => t('text_divider'), [t]);
  const tryAgainButtonText = useMemo(() => t('button_tryAgain'), [t]);
  const tryAgainSubText = useMemo(() => t('subtext_tryAgain'), [t]);
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
    <div className='cb-pk-error'>
      <Header className='cb-pk-error-light-header'>{headerText}</Header>
      <div className='cb-pk-error-bloc-icons-section'>
        <FingerPrintIcon className='cb-pk-error-bloc-icons-section-icon' />
        <FaceIdIcon className='cb-pk-error-bloc-icons-section-icon' />
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
        className='cb-pk-error-light-description'
      >
        {bodyDescriptionText}
      </Text>
      <PrimaryButton
        onClick={() => void passkeyLogin()}
        isLoading={loading}
        disabled={changingBlock}
      >
        {tryAgainButtonText}
      </PrimaryButton>
      <Text fontFamilyVariant='secondary'>{tryAgainSubText}</Text>
      {fallbacksAvailable && (
        <Divider
          label={dividerText}
          className='cb-pk-error-light-divider'
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
