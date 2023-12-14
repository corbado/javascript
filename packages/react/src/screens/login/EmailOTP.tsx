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
  const { t } = useTranslation('translation', { keyPrefix: 'login.emailOtp' });
  const { t: tErrors } = useTranslation('translation', { keyPrefix: 'errors' });
  const { navigateNext, currentFlow } = useFlowHandler();
  const { getUserAuthMethods, completeLoginWithEmailOTP } = useCorbado();
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
  const validationError = tErrors('serverErrors.InvalidOtpInputError');
  const verificationButtonText = t('button_verify');
  const backButtonText = t('button_back');

  const handleCancel = useCallback(() => navigateNext(FlowHandlerEvents.CancelOtp), []);

  const handleOTPVerification: EmailOtpScreenProps['onVerificationButtonClick'] = useCallback(
    async (otp: string, setLoading, setError) => {
      if (!email) {
        return;
      }

      setLoading(true);

      try {
        await makeApiCallWithErrorHandler(() => completeLoginWithEmailOTP(otp));

        const authMethods = await makeApiCallWithErrorHandler(() => getUserAuthMethods(email));
        const userHasPasskey = authMethods.selectedMethods.includes('webauthn');

        void navigateNext(FlowHandlerEvents.PasskeySuccess, { userHasPasskey });
      } catch (e) {
        setLoading(false);
        const error = e as RecoverableError;

        if (error.name === 'InvalidOtpInputError') {
          setError(tErrors('serverErrors.InvalidOtpInputError'));
          return;
        }

        throw e;
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
