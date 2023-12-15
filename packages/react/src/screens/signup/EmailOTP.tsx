import { useCorbado } from '@corbado/react-sdk';
import { FlowHandlerEvents, makeApiCallWithErrorHandler } from '@corbado/shared-ui';
import type { RecoverableError } from '@corbado/web-core';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { EmailOtpScreenProps } from '../../components';
import { EmailOtpScreenWrapper } from '../../components';
import useFlowHandler from '../../hooks/useFlowHandler';
import useUserData from '../../hooks/useUserData';

export const EmailOTP = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'authenticationFlows.signup.emailOtp' });
  const { t: tErrors } = useTranslation('translation', { keyPrefix: 'errors' });
  const { navigateNext, currentFlow } = useFlowHandler();
  const { completeSignUpWithEmailOTP } = useCorbado();
  const { email, sendEmail, setEmailError } = useUserData();

  React.useEffect(() => {
    sendEmail(currentFlow).catch(e => {
      const error = e as RecoverableError;

      if (error.name === 'InvalidUserInputError') {
        setEmailError(tErrors('serverError_unreachableEmail'));
      }

      void navigateNext(FlowHandlerEvents.CancelOtp);
    });
  }, []);

  const header = t('header');
  const body = (
    <>
      {t('body_text1')}
      <span className='cb-text-secondary'>{email}</span>
      {t('body_text2')}
    </>
  );
  const validationError = tErrors('serverError_invalidOtp');
  const verificationButtonText = t('button_verify');
  const backButtonText = t('button_back');

  const handleCancel = useCallback(() => navigateNext(FlowHandlerEvents.CancelOtp), []);

  const handleOTPVerification: EmailOtpScreenProps['onVerificationButtonClick'] = useCallback(
    async (otp: string, setLoading, setError) => {
      setLoading(true);

      await makeApiCallWithErrorHandler(
        () => completeSignUpWithEmailOTP(otp),
        () => void navigateNext(),
        error => {
          setLoading(false);

          if (error.name === 'InvalidOtpInputError') {
            setError(tErrors('serverError_invalidOtp'));
            return;
          }

          throw error;
        },
      );
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
      email,
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
