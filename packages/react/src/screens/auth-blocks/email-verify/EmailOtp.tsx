import { type EmailVerifyBlock, ScreenNames } from '@corbado/shared-ui';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { PrimaryButton } from '../../../components/ui2/buttons/PrimaryButton';
import { EmailLinks } from '../../../components/ui2/EmailLinks';
import { OtpInputGroup } from '../../../components/ui2/input/OtpInputGroup';
import { Header } from '../../../components/ui2/typography/Header';
import { Text } from '../../../components/ui2/typography/Text';
import { UserInfo } from '../../../components/ui2/UserInfo';
import { useTimer } from '../../../hooks/useTimer';

export const EmailOtp = ({ block }: { block: EmailVerifyBlock }) => {
  const { t } = useTranslation('translation', { keyPrefix: `${block.authType}.email-verify.email-otp` });
  const [loading, setLoading] = useState<boolean>(false);
  const { remainingTime, startTimer, startTimerOnScreenInit } = useTimer();

  const otpHasError = !loading && !!block.data.translatedError;

  useEffect(() => {
    setLoading(false);
    startTimerOnScreenInit(ScreenNames.EmailOtpVerification);
  }, [block]);

  const headerText = useMemo(() => t('header'), [t]);
  const bodyTitleText = useMemo(() => t('body_title'), [t]);
  const bodyDescriptionText = useMemo(() => t('body_description'), [t]);
  const bodyResendText = useMemo(() => t('body_resend'), [t]);
  const gmailLinkText = useMemo(() => t('button_gmail'), [t]);
  const yahooLinkText = useMemo(() => t('button_yahoo'), [t]);
  const outlookLinkText = useMemo(() => t('button_outlook'), [t]);
  const resendButtonText = useMemo(() => {
    if (remainingTime < 1) {
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
    await block.resendEmail();
    startTimer();
  }

  return (
    <div className='cb-email-otp-block-2'>
      <Header className='cb-email-otp-block-header-2'>{headerText}</Header>
      <UserInfo
        className='cb-email-otp-user-info-section-2'
        userData={block.data.email}
        onRightIconClick={() => void block.showEditEmail()}
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
        emittedOTP={handleOtpChange}
        loading={loading}
        error={block.data.translatedError}
        showErrorMessage={otpHasError}
      />
      <EmailLinks
        className='cb-email-otp-buton-group-2'
        gmailButtonLabel={gmailLinkText}
        yahooButtonLabel={yahooLinkText}
        outlookButtonLabel={outlookLinkText}
      />
      <Text
        fontFamilyVariant='secondary'
        className='cb-email-otp-resend-text-2'
      >
        {bodyResendText}
      </Text>
      <PrimaryButton
        className='cb-email-otp-resend-button-2'
        isLoading={loading}
        disabled={remainingTime > 0}
        onClick={() => void resendCode()}
      >
        {resendButtonText}
      </PrimaryButton>
    </div>
  );
};
