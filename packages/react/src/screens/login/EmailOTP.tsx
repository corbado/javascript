import { FlowHandlerEvents, useCorbado } from '@corbado/react-sdk';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { EmailOtpScreenProps } from '../../components';
import { EmailOtpScreenWrapper } from '../../components';
import useFlowHandler from '../../hooks/useFlowHandler';
import useUserData from '../../hooks/useUserData';

export const EmailOTP = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'login.emailOtp' });
  const { navigateBack, navigateNext, currentFlow } = useFlowHandler();
  const { getUserAuthMethods, completeLoginWithEmailOTP } = useCorbado();
  const { email, sendEmail } = useUserData();

  React.useEffect(() => {
    void sendEmail(currentFlow);
  }, []);

  const header = t('header');
  const body = (
    <>
      {t('body_text1')}
      <span className='cb-link-secondary'>{email}</span>
      {t('body_text2')}
    </>
  );
  const validationError = t('validationError_otp');
  const verificationButtonText = t('button_verify');
  const backButtonText = t('button_back');

  const handleCancel = useCallback(() => navigateBack(), []);

  const handleOTPVerification: EmailOtpScreenProps['onVerificationButtonClick'] = useCallback(
    async (otp: string, setLoading, setError) => {
      setLoading(true);
      try {
        await completeLoginWithEmailOTP(otp);
        const authMethods = await getUserAuthMethods(email ?? '');
        const userHasPasskey = authMethods.selectedMethods.includes('webauthn');
        void navigateNext(FlowHandlerEvents.PasskeySuccess, { userHasPasskey });
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
