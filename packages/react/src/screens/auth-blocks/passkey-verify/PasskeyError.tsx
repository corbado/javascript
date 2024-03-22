import type { PasskeyVerifyBlock } from '@corbado/shared-ui';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PrimaryButton } from '../../../components/ui2/buttons/PrimaryButton';
import { SecondaryButton } from '../../../components/ui2/buttons/SecondaryButton';
import { Divider } from '../../../components/ui2/Divider';
import { PasskeyErrorIcon } from '../../../components/ui2/icons/PasskeyErrorIcon';
import { PersonIcon } from '../../../components/ui2/icons/PersonIcon';
import { Header } from '../../../components/ui2/typography/Header';
import { Text } from '../../../components/ui2/typography/Text';
import { UserInfo } from '../../../components/ui2/UserInfo';

export const PasskeyError = ({ block }: { block: PasskeyVerifyBlock }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: `${block.authType}.passkey-verify.passkey-error`,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const headerText = useMemo(() => t('header'), [t]);
  const bodyTitleText = useMemo(() => t('body_title'), [t]);
  const bodyDescriptionText = useMemo(() => t('body_description'), [t]);
  const dividerText = useMemo(() => t('text_divider'), [t]);
  const primaryButtonText = useMemo(() => t('button_tryAgain'), [t]);

  const fallbacksAvailable = block.data.availableFallbacks.length > 0;

  const passkeyLogin = async () => {
    setLoading(true);
    await block.passkeyLogin();
    setLoading(false);
  };

  async function userInfoChange() {
    setLoading(true);
    await block.resetProcess();
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
          userData={block.data.identifierValue}
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
