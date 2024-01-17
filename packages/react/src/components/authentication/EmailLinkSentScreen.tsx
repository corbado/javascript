import type { FC, ReactNode } from 'react';
import React, { useEffect, useState } from 'react';

import useFlowHandler from '../../hooks/useFlowHandler';
import { Body, EmailLinks, Header, PrimaryButton, TertiaryButton } from '../ui';

export interface EmailLinkSentScreenProps {
  header: ReactNode;
  body?: ReactNode;
  resendButtonText: string;
  backButtonText: string;
  onResendButtonClick(setLoading: (newLoadingState: boolean) => void): Promise<void>;
  onBackButtonClick(): void;
}

export const EmailLinkSentScreen: FC<EmailLinkSentScreenProps> = ({
  header,
  body,
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

      <Body>{body}</Body>

      <EmailLinks />

      {currentUserState.emailOTPError && <p className='cb-error'>{currentUserState.emailOTPError.translatedMessage}</p>}

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
