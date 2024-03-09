import type { EmailVerifyBlock } from '@corbado/shared-ui';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Body, EmailProviderButtons, Header, PrimaryButton } from '../../../components';

export const EmailLinkSent = ({ block }: { block: EmailVerifyBlock }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: `${block.authType}.email-verify.email-link-sent`,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState(30);
  const [completedOnOtherDevice, setCompletedOnOtherDevice] = useState(false);
  const resendTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setLoading(false);
    const timer = startTimer();
    if (block.data.retryNotBefore) {
      const secondsNow = Math.floor(Date.now() / 1000);
      setRemainingTime(block.data.retryNotBefore - secondsNow);
    }

    return () => {
      clearInterval(timer);
    };
  }, [block]);

  function startTimer() {
    resendTimer.current = setInterval(() => {
      if (completedOnOtherDevice) {
        return;
      }

      setRemainingTime(time => time - 1);
    }, 1000);

    return resendTimer.current;
  }

  const header = t('header');
  const body = useMemo(
    () => (
      <>
        {t('body_text1')}
        <span className='cb-text-secondary cb-text-bold'>{block.data.email}</span>
        {t('body_text2')}
      </>
    ),
    [t, block],
  );

  const resendButtonText = useMemo(() => {
    if (remainingTime < 1) {
      if (resendTimer.current) {
        clearInterval(resendTimer.current);
      }

      return t('button_sendLinkAgain');
    }

    return (
      <Trans
        i18nKey='button_sendLinkAgainWaitingText'
        t={t}
        values={{
          remainingTime: remainingTime,
        }}
      />
    );
  }, [remainingTime]);

  const handleStatusChange = async () => {
    const res = await block.getVerificationStatus();
    if (res.err) {
      return;
    }

    setCompletedOnOtherDevice(res.val);
  };

  useEffect(() => {
    void handleStatusChange();
  }, [block, remainingTime]);

  if (completedOnOtherDevice) {
    return <div className='cb-email-link-verification'>Email has been verified. Continue on other tab</div>;
  }

  return (
    <form
      className='cb-email-screen'
      onSubmit={event => event.preventDefault()}
    >
      <Header>{header}</Header>
      <Body>{body}</Body>
      <EmailProviderButtons />
      <PrimaryButton
        isLoading={loading}
        disabled={remainingTime > 0}
        onClick={() => {
          setLoading(true);
          void block.resendEmail();
        }}
      >
        {resendButtonText}
      </PrimaryButton>
      {block.data.translatedError && <p className='cb-error'>{block.data.translatedError}</p>}
    </form>
  );
};
