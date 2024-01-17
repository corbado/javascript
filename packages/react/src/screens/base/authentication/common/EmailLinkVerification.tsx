import { FlowHandlerEvents } from '@corbado/shared-ui';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { EmailLinkVerificationScreenProps } from '../../../../components';
import { EmailLinkVerificationScreen } from '../../../../components';
import useFlowHandler from '../../../../hooks/useFlowHandler';

export const EmailLinkVerification = () => {
  const { emitEvent, currentUserState, currentFlow } = useFlowHandler();
  const { t } = useTranslation('translation', { keyPrefix: `authentication.${currentFlow}.emailLinkSent` });

  useEffect(() => {
    void emitEvent(FlowHandlerEvents.VerifyLink);
  }, []);

  const header = t('header');
  const body = (
    <>
      {t('body_text1')}
      <span className='cb-text-secondary cb-text-bold'>{currentUserState.email}</span>
      {t('body_text2')}
    </>
  );
  const resendButtonText = t('button_resend');
  const backButtonText = t('button_back');

  const handleCancel = useCallback(() => emitEvent(FlowHandlerEvents.CancelEmailLink), []);

  const handleResend: EmailLinkVerificationScreenProps['onResendButtonClick'] = useCallback(async setLoading => {
    setLoading(true);

    await emitEvent(FlowHandlerEvents.PrimaryButton);
  }, []);

  const props: EmailLinkVerificationScreenProps = useMemo(
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

  return <EmailLinkVerificationScreen {...props} />;
};
