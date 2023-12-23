import type { FC, FormEvent, ReactNode } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import useFlowHandler from '../../hooks/useFlowHandler';
import { Body, Button, Gmail, Header, IconLink, OtpInputGroup, Outlook, Yahoo } from '../ui';

export interface EmailOtpScreenProps {
  header: ReactNode;
  body?: ReactNode;
  verificationButtonText: string;
  backButtonText: string;

  onVerificationButtonClick(otp: string, setLoading: (newLoadingState: boolean) => void): Promise<void>;

  onBackButtonClick(): void;
}

export const EmailOtpScreenWrapper: FC<EmailOtpScreenProps> = ({
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

      <div className='cb-email-links'>
        <IconLink
          Icon={Gmail}
          label='Google'
          href='https://mail.google.com/mail/u/0/#search/from%3A%40corbado+in%3Aanywhere'
        />
        <IconLink
          Icon={Yahoo}
          label='Yahoo'
          href='https://mail.yahoo.com/d/search/keyword=corbado.com'
        />
        <IconLink
          Icon={Outlook}
          label='Outlook'
          href='https://outlook.office.com/mail/0/inbox'
        />
      </div>

      <OtpInputGroup
        emittedOTP={handleOtpChange}
        error={currentUserState.emailOTPError?.translatedMessage}
      />

      {currentUserState.emailOTPError && <p className='cb-error'>{currentUserState.emailOTPError.translatedMessage}</p>}

      <Button
        type='submit'
        ref={submitButtonRef}
        variant='primary'
        isLoading={loading}
        disabled={loading}
      >
        {verificationButtonText}
      </Button>

      <Button
        type='button'
        onClick={onBackButtonClick}
        variant='tertiary'
        disabled={loading}
      >
        {backButtonText}
      </Button>
    </form>
  );
};
