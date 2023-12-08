import { FlowHandlerEvents, useCorbado } from '@corbado/react-sdk';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { EmailOtpScreenProps } from '../../components';
import { EmailOtpScreenWrapper } from '../../components';
import useFlowHandler from '../../hooks/useFlowHandler';
import useUserData from '../../hooks/useUserData';

export const EmailOTP = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'signup.emailOtp' });
  const { navigateNext, currentFlow } = useFlowHandler();
  const { completeSignUpWithEmailOTP } = useCorbado();
  const { email, sendEmail } = useUserData();

  React.useEffect(() => {
    try {
      void sendEmail(currentFlow);
    } catch (error) {
      void navigateNext(FlowHandlerEvents.CancelOtp);
    }
  }, []);

  const header = t('header');
  const body = (
    <>
      {t('body_text1')}
      <span className='cb-text-secondary'>{email}</span>
      {t('body_text2')}
    </>
  );
  const validationError = t('validationError_otp');
  const verificationButtonText = t('button_verify');
  const backButtonText = t('button_back');

  const handleCancel = useCallback(() => navigateNext(FlowHandlerEvents.CancelOtp), []);

  const handleOTPVerification: EmailOtpScreenProps['onVerificationButtonClick'] = useCallback(
    async (otp: string, setLoading, setError) => {
      setLoading(true);
      try {
        await completeSignUpWithEmailOTP(otp);
        void navigateNext();
      } catch (error) {
        setLoading(false);
        setError(error as string);
      }
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
    [t, email, handleOTPVerification, handleCancel],
  );

  return <EmailOtpScreenWrapper {...props} />;
};