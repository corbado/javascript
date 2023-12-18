import { FlowHandlerEvents } from '@corbado/shared-ui';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { EmailOtpScreenProps } from '../../components';
import { EmailOtpScreenWrapper } from '../../components';
import useFlowHandler from '../../hooks/useFlowHandler';

export const EmailOTP = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'authenticationFlows.login.emailOtp' });
  const { t: tErrors } = useTranslation('translation', { keyPrefix: 'errors' });
  const { emitEvent, currentUserState } = useFlowHandler();

  const header = t('header');
  const body = (
    <>
      {t('body_text1')}
      <span className='cb-text-secondary'>{currentUserState.email}</span>
      {t('body_text2')}
    </>
  );
  const validationError = tErrors('serverError_invalidOtp');
  const verificationButtonText = t('button_verify');
  const backButtonText = t('button_back');

  const handleCancel = useCallback(() => emitEvent(FlowHandlerEvents.CancelOtp), []);

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
      validationError,
      verificationButtonText,
      backButtonText,
      onVerificationButtonClick: handleOTPVerification,
      onBackButtonClick: handleCancel,
    }),
    [
      t,
      currentUserState.email,
      handleOTPVerification,
      handleCancel,
      header,
      body,
      validationError,
      verificationButtonText,
      backButtonText,
    ],
  );

  return <EmailOtpScreenWrapper {...props} />;
};
