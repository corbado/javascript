import type { FC, ReactNode } from 'react';
import React, { useEffect, useState } from 'react';

import useFlowHandler from '../../hooks/useFlowHandler';
import { Body, Header, PrimaryButton, TertiaryButton } from '../ui';

export interface EmailLinkVerificationScreenProps {
  header: ReactNode;
  resendButtonText: string;
  backButtonText: string;
  onResendButtonClick(setLoading: (newLoadingState: boolean) => void): Promise<void>;
  onBackButtonClick(): void;
}

export const EmailLinkVerificationScreen: FC<EmailLinkVerificationScreenProps> = ({
  header,
  resendButtonText,
  backButtonText,
  onResendButtonClick,
  onBackButtonClick,
}) => {
  const { currentUserState } = useFlowHandler();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(false);
  }, [currentUserState]);

  const handleResend = () => {
    void onResendButtonClick(setLoading);
  };

  return (
    <div className='cb-email-otp'>
      <Header>{header}</Header>

      <Body>
        {currentUserState.emailOTPError && (
          <p className='cb-error'>{currentUserState.emailOTPError.translatedMessage}</p>
        )}
      </Body>

      <PrimaryButton
        onClick={handleResend}
        isLoading={loading}
      >
        {resendButtonText}
      </PrimaryButton>
      <TertiaryButton
        onClick={onBackButtonClick}
        disabled={loading}
      >
        {backButtonText}
      </TertiaryButton>
    </div>
  );
};
