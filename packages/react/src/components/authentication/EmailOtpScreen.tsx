import type { FC, FormEvent, ReactNode } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import useFlowHandler from '../../hooks/useFlowHandler';
import { Body, EmailLinks, Header, OtpInputGroup, PrimaryButton, TertiaryButton } from '../ui';

export interface EmailOtpScreenProps {
  header: ReactNode;
  body?: ReactNode;
  verificationButtonText: string;
  backButtonText: string;
  onVerificationButtonClick(otp: string, setLoading: (newLoadingState: boolean) => void): Promise<void>;
  onBackButtonClick(): void;
}

export const EmailOtpScreen: FC<EmailOtpScreenProps> = ({
  header,
  body,
  verificationButtonText,
  backButtonText,
  onVerificationButtonClick,
  onBackButtonClick,
}) => {
  const [otp, setOTP] = useState<string>('');
  const { currentUserState } = useFlowHandler();
  const [loading, setLoading] = useState<boolean>(false);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setLoading(false);
  }, [currentUserState]);

  const handleOtpChange = useCallback(
    (userOtp: string[]) => {
      const newOtp = userOtp.join('');
      setOTP(newOtp);

      if (newOtp.length === 6) {
        void onVerificationButtonClick(newOtp, setLoading);
      }
    },
    [setOTP],
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void onVerificationButtonClick(otp, setLoading);
  };

  return (
    <form
      className='cb-email-otp'
      onSubmit={handleSubmit}
    >
      <Header>{header}</Header>

      <Body>{body}</Body>

      <EmailLinks />

      <OtpInputGroup
        emittedOTP={handleOtpChange}
        error={currentUserState.emailOTPError?.translatedMessage}
      />

      {currentUserState.emailOTPError && <p className='cb-error'>{currentUserState.emailOTPError.translatedMessage}</p>}

      <PrimaryButton
        ref={submitButtonRef}
        isLoading={loading}
      >
        {verificationButtonText}
      </PrimaryButton>
      <TertiaryButton
        onClick={onBackButtonClick}
        disabled={loading}
      >
        {backButtonText}
      </TertiaryButton>
    </form>
  );
};
