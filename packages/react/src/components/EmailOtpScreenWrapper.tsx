import type { FC, ReactNode } from 'react';
import { useCallback, useState } from 'react';
import React from 'react';

import { Body } from './Body';
import { Button } from './Button';
import { Header } from './Header';
import { IconLink } from './IconLink';
import { Gmail, Outlook, Yahoo } from './icons';
import { OTPInput } from './OtpInput';

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
  const [otp, setOTP] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleOtpChange = useCallback((userOTP: string[]) => setOTP(userOTP), [setOTP]);

  const handleSubmit = () => {
    const mergedChars = otp.join('');

    if (mergedChars.length < 6) {
      setError(validationError);
      return;
    }

    setError('');

    void onVerificationButtonClick(mergedChars, setLoading, setError);
  };

  return (
    <div className='cb-email-otp'>
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

      <OTPInput emittedOTP={handleOtpChange} />

      {error && <p className='cb-error'>{error}</p>}

      <Button
        type='button'
        onClick={handleSubmit}
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
    </div>
  );
};
