import { FlowHandlerEvents } from '@corbado/shared-ui';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { EmailScreenBase, PrimaryButton, TertiaryButton } from '../../../../components';
import useFlowHandler from '../../../../hooks/useFlowHandler';

export const EmailLinkSent = () => {
  const { emitEvent, currentUserState, currentFlowType } = useFlowHandler();
  const { t } = useTranslation('translation', { keyPrefix: `authentication.${currentFlowType}.emailLinkSent` });
  const [remainingTime, setRemainingTime] = useState(30);
  const [loading, setLoading] = useState<boolean>(false);
  const resendTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const timer = startTimer();

    return () => clearInterval(timer);
  }, []);

  function startTimer() {
    resendTimer.current = setInterval(() => setRemainingTime(time => time - 1), 1000);

    return resendTimer.current;
  }

  const header = t('header');
  const body = useMemo(
    () => (
      <>
        {t('body_text1')}
        <span className='cb-text-secondary cb-text-bold'>{currentUserState.email}</span>
        {t('body_text2')}
      </>
    ),
    [t, currentUserState],
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
  const backButtonText = t('button_back');

  const handleCancel = useCallback(() => void emitEvent(FlowHandlerEvents.CancelEmailLink), []);

  const handleResend = useCallback(async () => {
    setLoading(true);

    await emitEvent(FlowHandlerEvents.PrimaryButton);

    startTimer();
    setLoading(false);
  }, []);

  return (
    <div className='cb-email-screen'>
      <EmailScreenBase
        header={header}
        body={body}
      />

      <PrimaryButton
        onClick={() => void handleResend()}
        isLoading={loading}
        disabled={remainingTime > 0}
      >
        {resendButtonText}
      </PrimaryButton>

      <TertiaryButton
        onClick={handleCancel}
        disabled={loading}
      >
        {backButtonText}
      </TertiaryButton>
    </div>
  );
};
