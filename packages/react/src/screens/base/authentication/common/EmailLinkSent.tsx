import { FlowHandlerEvents } from '@corbado/shared-ui';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type { EmailLinkSentScreenProps } from '../../../../components';
import { EmailLinkSentScreen } from '../../../../components';
import useFlowHandler from '../../../../hooks/useFlowHandler';

export const EmailLinkSent = () => {
  const { emitEvent, currentUserState, currentFlowType } = useFlowHandler();
  const { t } = useTranslation('translation', { keyPrefix: `authentication.${currentFlowType}.emailLinkSent` });
  const [remainingTime, setRemainingTime] = React.useState(30);
  const resendTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    resendTimer.current = setInterval(() => setRemainingTime(time => time - 1), 1000);

    return () => clearInterval(resendTimer.current);
  }, []);

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

  const handleCancel = useCallback(() => emitEvent(FlowHandlerEvents.CancelEmailLink), []);

  const handleResend: EmailLinkSentScreenProps['onResendButtonClick'] = useCallback(async setLoading => {
    setLoading(true);

    await emitEvent(FlowHandlerEvents.PrimaryButton);
  }, []);

  const props: EmailLinkSentScreenProps = useMemo(
    () => ({
      header,
      body,
      resendButtonText,
      backButtonText,
      onResendButtonClick: handleResend,
      onBackButtonClick: handleCancel,
    }),
    [t, currentUserState.email, handleResend, handleCancel, header, body, resendButtonText, backButtonText],
  );

  return <EmailLinkSentScreen {...props} />;
};
