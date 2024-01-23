import type { FC, FormEvent, ReactNode } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import useFlowHandler from '../../hooks/useFlowHandler';
import { OtpInputGroup, PrimaryButton, TertiaryButton } from '../ui';
import { EmailScreenBase } from './EmailScreensBase';

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
  const { currentUserState } = useFlowHandler();
  const [loading, setLoading] = useState<boolean>(false);
  const otpRef = useRef<string>('');

  useEffect(() => {
    setLoading(false);
  }, [currentUserState]);

  const handleOtpChange = useCallback(
    (userOtp: string[]) => {
      const newOtp = userOtp.join('');
      otpRef.current = newOtp;

      if (newOtp.length === 6) {
        void onVerificationButtonClick(newOtp, setLoading);
      }
    },
    [onVerificationButtonClick],
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void onVerificationButtonClick(otpRef.current, setLoading);
  };

  return (
    <form
      className='cb-email-screen'
      onSubmit={handleSubmit}
    >
      <EmailScreenBase
        header={header}
        body={body}
      >
        <OtpInputGroup
          emittedOTP={handleOtpChange}
          error={currentUserState.verificationError?.translatedMessage}
        />
      </EmailScreenBase>

      <PrimaryButton isLoading={loading}>{verificationButtonText}</PrimaryButton>
      <TertiaryButton
        onClick={onBackButtonClick}
        disabled={loading}
      >
        {backButtonText}
      </TertiaryButton>
    </form>
  );
};
