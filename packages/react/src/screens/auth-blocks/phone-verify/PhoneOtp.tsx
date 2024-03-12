import type { PhoneVerifyBlock } from '@corbado/shared-ui';
import { AuthType } from '@corbado/shared-ui';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { PrimaryButton } from '../../../components/ui2/buttons/PrimaryButton';
import { OtpInputGroup } from '../../../components/ui2/input/OtpInputGroup';
import { Header } from '../../../components/ui2/typography/Header';
import { Text } from '../../../components/ui2/typography/Text';
import { UserInfo } from '../../../components/ui2/UserInfo';

export const PhoneOtp = ({ block }: { block: PhoneVerifyBlock }) => {
  const { t } = useTranslation('translation', { keyPrefix: `signup.phone-verify.phone-otp` });
  const [loading, setLoading] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const timer = useRef<NodeJS.Timeout>();

  const otpHasError = !loading && !!block.data.translatedError;

  useEffect(() => {
    setLoading(false);

    if (block.data.retryNotBefore) {
      const secondsNow = Math.floor(Date.now() / 1000);
      setRemainingTime(block.data.retryNotBefore - secondsNow);
    }

    const timer = startTimer();

    return () => clearInterval(timer);
  }, [block]);

  const headerText = useMemo(() => t('header'), [t]);
  const bodyTitleText = useMemo(() => t('body_title'), [t]);
  const bodyDescriptionText = useMemo(() => t('body_description'), [t]);
  const bodyResendText = useMemo(() => t('body_resend'), [t]);
  const resendButtonText = useMemo(() => {
    if (remainingTime < 1) {
      if (timer.current) {
        clearInterval(timer.current);
      }

      return t('button_resend');
    }

    return (
      <Trans
        i18nKey='button_resendWaitingText'
        t={t}
        values={{
          remainingTime: remainingTime,
        }}
      />
    );
  }, [remainingTime]);

  function startTimer() {
    timer.current = setInterval(() => setRemainingTime(time => time - 1), 1000);

    return timer.current;
  }

  const handleOtpChange = useCallback(
    (userOtp: string[]) => {
      const otp = userOtp.join('');
      if (otp.length !== 6) {
        return;
      }

      setLoading(true);
      void block.validateCode(otp);
    },
    [block],
  );

  async function resendCode() {
    setLoading(true);
    await block.resendCode();
    startTimer();
  }

  return (
    <div className='cb-phone-otp-block-2'>
      <Header className='cb-phone-otp-block-header-2'>{headerText}</Header>
      <UserInfo
        className='cb-phone-otp-user-info-section-2'
        userData={block.data.phone}
        onRightIconClick={() => void block.showEditPhone()}
      ></UserInfo>
      <Text
        level='2'
        fontWeight='bold'
        fontFamilyVariant='secondary'
        className='cb-row-2'
      >
        {bodyTitleText}
      </Text>
      <Text
        level='2'
        fontFamilyVariant='secondary'
      >
        {bodyDescriptionText}
      </Text>
      <OtpInputGroup
        className='cb-phone-otp-input-container-2'
        emittedOTP={handleOtpChange}
        loading={loading}
        error={block.data.translatedError}
        showErrorMessage={otpHasError}
      />
      <Text
        fontFamilyVariant='secondary'
        className='cb-phone-otp-resend-text-2'
      >
        {bodyResendText}
      </Text>
      <PrimaryButton
        className='cb-phone-otp-resend-button-2'
        isLoading={loading}
        disabled={remainingTime > 0}
        onClick={() => void resendCode()}
      >
        {resendButtonText}
      </PrimaryButton>
      {block.authType === AuthType.Login && (
        <PrimaryButton onClick={() => void block.resetProcess()}>Reset</PrimaryButton>
      )}
    </div>
  );
};
