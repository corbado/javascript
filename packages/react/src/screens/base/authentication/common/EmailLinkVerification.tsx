import { FlowHandlerEvents } from '@corbado/shared-ui';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { EmailLinkVerificationScreenProps } from '../../../../components';
import { EmailLinkVerificationScreen } from '../../../../components';
import useFlowHandler from '../../../../hooks/useFlowHandler';

export const EmailLinkVerification = () => {
  const { emitEvent, currentUserState, currentFlowType } = useFlowHandler();
  const { t } = useTranslation('translation', { keyPrefix: `authentication.${currentFlowType}.emailLinkVerification` });

  useEffect(() => {
    void emitEvent(FlowHandlerEvents.VerifyLink);
  }, []);

  const header = t('header');
  const resendButtonText = t('button_sendLinkAgain');
  const backButtonText = t('button_back');

  const handleCancel = useCallback(() => emitEvent(FlowHandlerEvents.CancelEmailLink), []);

  const handleResend: EmailLinkVerificationScreenProps['onResendButtonClick'] = useCallback(async setLoading => {
    setLoading(true);

    await emitEvent(FlowHandlerEvents.PrimaryButton);
  }, []);

  const props: EmailLinkVerificationScreenProps = useMemo(
    () => ({
      header,
      resendButtonText,
      backButtonText,
      onResendButtonClick: handleResend,
      onBackButtonClick: handleCancel,
    }),
    [t, currentUserState.email, handleResend, handleCancel, header, resendButtonText, backButtonText],
  );

  return <EmailLinkVerificationScreen {...props} />;
};
