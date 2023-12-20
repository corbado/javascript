import type { FC, FormEvent, ReactNode } from 'react';
import { useCallback, useRef, useState } from 'react';
import React from 'react';

import { Body, Button, Gmail, Header, IconLink, OtpInputGroup, Outlook, Yahoo } from '../ui';

export interface EmailOtpScreenProps {
  header: ReactNode;
  body?: ReactNode;
  verificationButtonText: string;
  backButtonText: string;
  validationError: string;
  onVerificationButtonClick(
    otp: string,
    setLoading: (newLoadingState: boolean) => void,
    setError: (newError: string) => void,
  ): Promise<void>;
  onBackButtonClick(): void;
}

export const EmailOtpScreenWrapper: FC<EmailOtpScreenProps> = ({
  header,
  body,
  verificationButtonText,
  backButtonText,
  validationError,
  onVerificationButtonClick,
  onBackButtonClick,
}) => {
  const [error, setError] = useState('');
  const [otp, setOTP] = useState<string>('');
  const [isOtpValid, setIsOtpValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const handleOtpChange = useCallback(
    (userOtp: string[]) => {
      const newOtp = userOtp.join('');
      setOTP(newOtp);

      const isValid = newOtp.length === 6;
      setIsOtpValid(isValid);

      if (isValid) {
        void onVerificationButtonClick(newOtp, setLoading, setError);
      }
    },
    [setOTP, setIsOtpValid],
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isOtpValid) {
      setError(validationError);
      return;
    }

    setError('');

    void onVerificationButtonClick(otp, setLoading, setError);
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

      <OtpInputGroup emittedOTP={handleOtpChange} />

      {error && <p className='cb-error'>{error}</p>}

      <Button
        type='submit'
        ref={submitButtonRef}
        variant='primary'
        isLoading={loading}
        disabled={!isOtpValid || loading}
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
