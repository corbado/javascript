import { Gmail, Yahoo, Outlook } from './Icons';
import { IconLink } from './IconLink';
import { OTPInput } from './OtpInput';
import { Button } from './Button';
import { FC, ReactNode, useCallback, useState } from 'react';
import { Header } from './Header';
import { Body } from './Body';

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

export const EmailOtpScreen: FC<EmailOtpScreenProps> = ({
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
    setError('');
    const mergedChars = otp.join('');
    if (mergedChars.length < 6) {
      setError(validationError);
      return;
    }

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
      {error && <p className='error-text mt-3 ml-0'>{error}</p>}

      <Button
        type='button'
        onClick={handleSubmit}
        className='mt-4'
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
