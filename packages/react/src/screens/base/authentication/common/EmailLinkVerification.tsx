import { FlowHandlerEvents } from '@corbado/shared-ui';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Body, Header, PrimaryButton, TertiaryButton } from '../../../../components';
import useFlowHandler from '../../../../hooks/useFlowHandler';

export const EmailLinkVerification = () => {
  const { emitEvent, currentUserState, currentFlowType } = useFlowHandler();
  const { t } = useTranslation('translation', { keyPrefix: `authentication.${currentFlowType}.emailLinkVerification` });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    void emitEvent(FlowHandlerEvents.VerifyLink);
  }, []);

  useEffect(() => {
    if (currentUserState.verificationError) {
      setLoading(false);
    }
  }, [currentUserState]);

  const header = t('header');
  const resendButtonText = t('button_sendLinkAgain');
  const backButtonText = t('button_back');

  const handleCancel = useCallback(() => void emitEvent(FlowHandlerEvents.CancelEmailLink), []);

  const handleResend = useCallback(() => {
    setLoading(true);

    void emitEvent(FlowHandlerEvents.PrimaryButton);
  }, []);

  return (
    <div className='cb-email-screen'>
      <Header>{header}</Header>

      <Body>{currentUserState.verificationError && currentUserState.verificationError.translatedMessage}</Body>

      <PrimaryButton
        onClick={handleResend}
        isLoading={loading}
        disabled={loading}
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
