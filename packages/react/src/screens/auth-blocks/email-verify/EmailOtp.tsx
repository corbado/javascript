import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import { EmailLinks } from '../../../components/ui/EmailLinks';
import { EmailIcon } from '../../../components/ui/icons/EmailIcon';
import { OtpInputGroup } from '../../../components/ui/input/OtpInputGroup';
import { Header } from '../../../components/ui/typography/Header';
import { Text } from '../../../components/ui/typography/Text';
import { UserInfo } from '../../../components/ui/UserInfo';
import { useTelemetry } from '../../../hooks/useTelemetry';
import type { EmailVerifyBlock } from '../../../shared-ui';
import { AuthType } from '../../../shared-ui';

export const EmailOtp = ({ block }: { block: EmailVerifyBlock }) => {
  const { t } = useTranslation('translation', { keyPrefix: `${block.authType}.email-verify.email-otp` });
  const { logMethodCalled } = useTelemetry();
  const [loading, setLoading] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const timer = useRef<NodeJS.Timeout>();

  const otpHasError = !loading && !!block.data.translatedError;

  useEffect(() => {
    setLoading(false);

    const timer = startTimer();

    return () => clearInterval(timer);
  }, [block]);

  const descriptionTexts = useMemo(() => {
    if (block.data.isPostLoginVerification) {
      return {
        header: t('postLoginVerification.header'),
        bodyTitle: t('postLoginVerification.body_title'),
        bodyDescription: t('postLoginVerification.body_description'),
      };
    }

    return {
      header: t('header'),
      bodyTitle: t('body_title'),
      bodyDescription: t('body_description'),
    };
  }, [t]);
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
    let newRemainingTime = 30;

    if (block.data.retryNotBefore) {
      const secondsNow = Math.floor(Date.now() / 1000);
      newRemainingTime = block.data.retryNotBefore - secondsNow;
    }

    if (newRemainingTime < 1) {
      return;
    }

    setRemainingTime(newRemainingTime);
    timer.current = setInterval(() => setRemainingTime(time => time - 1), 1000);

    return timer.current;
  }

  const handleOtpChange = useCallback(
    (userOtp: string[]) => {
      const otp = userOtp.join('');
      if (otp.length > 0) {
        block.notifyOTPStarted();
      }

      if (otp.length !== 6) {
        return;
      }

      setLoading(true);
      logMethodCalled('validateCode', 'EmailOtp');
      void block.validateCode(otp);
    },
    [block, logMethodCalled],
  );

  const resendCode = useCallback(async () => {
    setLoading(true);
    logMethodCalled('resendEmail', 'EmailOtp');
    await block.resendEmail();
    startTimer();
    setLoading(false);
  }, [block, logMethodCalled]);

  const emailChange = useCallback(async () => {
    if (block.authType === AuthType.Login) {
      setLoading(true);
      logMethodCalled('confirmAbort', 'EmailOtp');
      await block.confirmAbort();
      setLoading(false);
    }

    logMethodCalled('showEditEmail', 'EmailOtp');
    block.showEditEmail();
  }, [block, logMethodCalled]);

  return (
    <div className='cb-email-block'>
      <Header className='cb-email-block-header'>{descriptionTexts.header}</Header>
      <UserInfo
        className='cb-email-user-info-section'
        leftIcon={<EmailIcon className='cb-email-block-user-info-left-icon' />}
        userData={block.data.email}
        onRightIconClick={() => void emailChange()}
      ></UserInfo>
      <Text
        level='2'
        fontWeight='bold'
        fontFamilyVariant='secondary'
        className='cb-row'
      >
        {descriptionTexts.bodyTitle}
      </Text>
      <Text
        level='2'
        fontFamilyVariant='secondary'
      >
        {descriptionTexts.bodyDescription}
      </Text>
      <OtpInputGroup
        emittedOTP={handleOtpChange}
        loading={loading}
        error={block.data.translatedError}
        showErrorMessage={otpHasError}
      />
      <EmailLinks
        className='cb-email-otp-buton-group'
        email={block.data.email}
        t={t}
      />
      <Text fontFamilyVariant='primary'>{bodyResendText}</Text>
      <PrimaryButton
        className='cb-email-resend-button'
        isLoading={loading}
        disabled={remainingTime > 0}
        onClick={() => void resendCode()}
      >
        {resendButtonText}
      </PrimaryButton>
    </div>
  );
};
