import type { EmailVerifyBlock } from '@corbado/shared-ui';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { PrimaryButton } from '../../../components/ui2/buttons/PrimaryButton';
import { EmailLinks } from '../../../components/ui2/EmailLinks';
import { Header } from '../../../components/ui2/typography/Header';
import { Text } from '../../../components/ui2/typography/Text';
import { UserInfo } from '../../../components/ui2/UserInfo';
import { EmailLinkSuccess } from './EmailLinkSuccess';

// we poll for a maximum of 10 minutes (120 * 5000ms = 10min)
const pollIntervalMs = 2000;
const pollMaxNumber = 120;

export const EmailLinkSent = ({ block }: { block: EmailVerifyBlock }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: `${block.authType}.email-verify.email-link-sent`,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [completedOnOtherDevice, setCompletedOnOtherDevice] = useState(false);
  const resendTimer = useRef<NodeJS.Timeout>();
  const pollingTimer = useRef<NodeJS.Timeout>();
  const remainingPolls = useRef<number>(pollMaxNumber);

  useEffect(() => {
    setLoading(false);

    startResendTimer();
    startPolling();

    return () => {
      clearInterval(resendTimer.current);
      clearTimeout(pollingTimer.current);
    };
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

  const startResendTimer = () => {
    let newRemainingTime = 30;

    if (block.data.retryNotBefore) {
      const secondsNow = Math.floor(Date.now() / 1000);
      newRemainingTime = block.data.retryNotBefore - secondsNow;
    }

    if (newRemainingTime < 1) {
      return;
    }

    setRemainingTime(newRemainingTime);

    resendTimer.current = setInterval(() => {
      setRemainingTime(time => time - 1);
    }, 1000);
  };

  const startPolling = () => {
    if (remainingPolls.current < 1) {
      return;
    }

    pollingTimer.current = setTimeout(() => {
      block
        .getVerificationStatus()
        .then(res => {
          if (res.err) {
            throw res.err;
          }

          if (res.val) {
            remainingPolls.current = 0;
            setCompletedOnOtherDevice(true);
          }

          remainingPolls.current -= 1;
          startPolling();
        })
        .catch(() => {
          return;
        });
    }, pollIntervalMs);
  };

  const resendEmail = async () => {
    setLoading(true);

    await block.resendEmail();

    startResendTimer();

    remainingPolls.current = pollMaxNumber;
    startPolling();

    setLoading(false);
  };

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
        onClick={() => void resendEmail()}
      >
        {resendButtonText}
      </PrimaryButton>
      {/* {block.authType === AuthType.Login && (
        <PrimaryButton onClick={() => void block.resetProcess()}>Reset</PrimaryButton>
      )} */}
    </div>
  );
};
