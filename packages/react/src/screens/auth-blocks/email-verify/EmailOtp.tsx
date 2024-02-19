import type { EmailVerifyBlock } from '@corbado/shared-ui';
import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Body, EmailProviderButtons, Header, OtpInputGroup, PrimaryButton } from '../../../components';

export const EmailOtp = ({ block }: { block: EmailVerifyBlock }) => {
  const { t } = useTranslation('translation', { keyPrefix: `authentication.email-verify.email-otp` });
  const [loading, setLoading] = useState<boolean>(false);
  const otpRef = useRef<string>('');

  const header = t('header');
  const body = (
    <>
      {t('body_text1')}
      <span className='cb-text-secondary cb-text-bold'>{block.data.email}</span>
      {t('body_text2')}
    </>
  );
  const resendButtonText = t('button_resend');

  const handleOtpChange = useCallback(
    (userOtp: string[]) => {
      const newOtp = userOtp.join('');
      otpRef.current = newOtp;

      if (newOtp.length === 6) {
        setLoading(true);
        void block.validateCode(newOtp);
      }
    },
    [block],
  );

  return (
    <form className='cb-email-screen'>
      <Header>{header}</Header>
      <Body>{body}</Body>

      <EmailProviderButtons />
      <OtpInputGroup
        emittedOTP={handleOtpChange}
        error={block.data.translatedError}
      />

      {block.data.translatedError && <p className='cb-error'>{block.data.translatedError}</p>}

      <PrimaryButton
        isLoading={loading}
        onClick={block.resendCode}
      >
        {resendButtonText}
      </PrimaryButton>
    </form>
  );
};
