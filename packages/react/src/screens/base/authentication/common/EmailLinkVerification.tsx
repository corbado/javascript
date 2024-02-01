import { FlowHandlerEvents } from '@corbado/shared-ui';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Body, Header, Spinner, TertiaryButton } from '../../../../components';
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
  const backButtonText = t('button_back');

  const handleCancel = useCallback(() => void emitEvent(FlowHandlerEvents.CancelEmailLink), []);

  return (
    <div className='cb-email-screen'>
      <Header>{header}</Header>

      <Body>{currentUserState.verificationError && currentUserState.verificationError.translatedMessage}</Body>

      {loading ? <Spinner /> : null}
      <TertiaryButton
        onClick={handleCancel}
        disabled={loading}
      >
        {backButtonText}
      </TertiaryButton>
    </div>
  );
};
