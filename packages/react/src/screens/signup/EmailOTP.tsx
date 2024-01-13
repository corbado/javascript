import { FlowHandlerEvents } from '@corbado/shared-ui';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { EmailOtpScreenProps } from '../../components';
import { EmailOtpScreenWrapper } from '../../components';
import useFlowHandler from '../../hooks/useFlowHandler';

export const EmailOTP = () => {
  const { emitEvent, currentUserState, currentFlowStyle } = useFlowHandler();
  const { t } = useTranslation('translation', { keyPrefix: `authenticationFlows.signup.${currentFlowStyle}.emailOtp` });

  const header = t('header');
  const body = (
    <>
      {t('body_text1')}
      <span className='cb-text-secondary'>{currentUserState.email}</span>
      {t('body_text2')}
    </>
  );
  const verificationButtonText = t('button_verify');
  const backButtonText = t('button_back');

  const handleCancel = useCallback(() => emitEvent(FlowHandlerEvents.SecondaryButton), []);

  const handleOTPVerification: EmailOtpScreenProps['onVerificationButtonClick'] = useCallback(
    async (otp: string, setLoading) => {
      setLoading(true);
      await emitEvent(FlowHandlerEvents.PrimaryButton, { emailOTPCode: otp });
    },
    [],
  );

  const props: EmailOtpScreenProps = useMemo(
    () => ({
      header,
      body,
      verificationButtonText,
      backButtonText,
      onVerificationButtonClick: handleOTPVerification,
      onBackButtonClick: handleCancel,
    }),
    [t, currentUserState, handleOTPVerification, handleCancel, header, body, verificationButtonText, backButtonText],
  );

  return <EmailOtpScreenWrapper {...props} />;
};
