import type { EmailVerifyBlock } from '@corbado/shared-ui';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { PrimaryButton } from '../../../components/ui2/buttons/PrimaryButton';
import { EmailLinks } from '../../../components/ui2/EmailLinks';
import { Header } from '../../../components/ui2/typography/Header';
import { Text } from '../../../components/ui2/typography/Text';
import { UserInfo } from '../../../components/ui2/UserInfo';
import { EmailLinkSuccess } from './EmailLinkSuccess';

// we poll for a maximum of 5 minutes (300 * 1000ms = 5min)
const pollIntervalMs = 1000;
const pollMaxNumber = 300;

export const EmailLinkSent = ({ block }: { block: EmailVerifyBlock }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: `${block.authType}.email-verify.email-link-sent`,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState(30);
  const [remainingPolls, setRemainingPolls] = useState(pollMaxNumber);
  const [completedOnOtherDevice, setCompletedOnOtherDevice] = useState(false);
  const resendTimer = useRef<NodeJS.Timeout>();
  const pollingTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setLoading(false);
    startCountDownTimer();

    if (block.data.retryNotBefore) {
      const secondsNow = Math.floor(Date.now() / 1000);
      setRemainingTime(block.data.retryNotBefore - secondsNow);
    }

    startPollingTimer();

    return () => {
      clearInterval(resendTimer.current);
      clearInterval(pollingTimer.current);
    };
  }, [block]);

  useEffect(() => {
    if (completedOnOtherDevice || remainingPolls < 1) {
      return;
    }

    void handleStatusChange();
  }, [block, remainingPolls]);

  const startCountDownTimer = () => {
    resendTimer.current = setInterval(() => {
      if (completedOnOtherDevice) {
        return;
      }

      setRemainingTime(time => time - 1);
    }, 1000);
  };

  const startPollingTimer = () => {
    pollingTimer.current = setInterval(() => {
      setRemainingPolls(v => v - 1);
    }, pollIntervalMs);
  };

  const handleStatusChange = async () => {
    const res = await block.getVerificationStatus();
    if (res.err) {
      return;
    }

    setCompletedOnOtherDevice(res.val);
  };

  const headerText = useMemo(() => t('header'), [t]);
  const bodyTitleText = useMemo(() => t('body_title'), [t]);
  const bodyDescriptionText = useMemo(() => t('body_description'), [t]);
  const bodyResendText = useMemo(() => t('body_resend'), [t]);
  const gmailLinkText = useMemo(() => t('button_gmail'), [t]);
  const yahooLinkText = useMemo(() => t('button_yahoo'), [t]);
  const outlookLinkText = useMemo(() => t('button_outlook'), [t]);
  const resendButtonText = useMemo(() => {
    if (remainingTime < 1) {
      if (resendTimer.current) {
        clearInterval(resendTimer.current);
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

  if (completedOnOtherDevice) {
    return (
      <EmailLinkSuccess
        block={block}
        isOldTab={true}
      />
    );
  }

  return (
    <div className='cb-email-block-2'>
      <Header className='cb-email-block-header-2'>{headerText}</Header>
      <UserInfo
        className='cb-email-user-info-section-2'
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
      <EmailLinks
        className='cb-email-link-buton-group-2'
        gmailButtonLabel={gmailLinkText}
        yahooButtonLabel={yahooLinkText}
        outlookButtonLabel={outlookLinkText}
      />
      <Text fontFamilyVariant='secondary'>{bodyResendText}</Text>
      <PrimaryButton
        className='cb-email-resend-button-2'
        isLoading={loading}
        disabled={remainingTime > 0}
        onClick={() => {
          setLoading(true);
          void block.resendEmail();
        }}
      >
        {resendButtonText}
      </PrimaryButton>
    </div>
  );
};
