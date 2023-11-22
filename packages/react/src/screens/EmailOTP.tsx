import { useCorbado } from '@corbado/react-sdk';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Button, Gmail, Link, OTPInput, Outlook, Text, Yahoo } from '../components';
import useFlowHandler from '../hooks/useFlowHandler';
import useUserData from '../hooks/useUserData';

export const EmailOTP = () => {
  const { t } = useTranslation();
  const { navigateBack, navigateNext } = useFlowHandler();
  const { completeSignUpWithEmailOTP } = useCorbado();
  const { email } = useUserData();

  const [otp, setOTP] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleCancel = () => navigateBack();

  const handleOtpChange = (userOTP: string[]) => setOTP(userOTP);

  const handleOTPVerification = async (payload: string) => {
    setLoading(true);
    try {
      await completeSignUpWithEmailOTP(payload);
      void navigateNext();
    } catch (error) {
      console.log({ error });
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    setError('');
    const mergedChars = otp.join('');
    if (mergedChars.length < 6) {
      setError(t('email_link.otp_required'));
      return;
    }

    void handleOTPVerification(mergedChars);
  };

  return (
    <>
      <Text variant='header'>{t('email_link.header')}</Text>
      <Text className='font-medium'>
        {/* "text" is a placeholder value for translations */}
        <Trans i18nKey='email_link.body'>
          text <span className='text-secondary-font-color'>{email}</span> text
        </Trans>
      </Text>
      <div className='grid grid-cols-3 gap-3 mt-4'>
        <Link
          href='https://mail.google.com/mail/u/0/#search/from%3A%40corbado+in%3Aanywhere'
          className='flex items-center email-client h-12 border border-light-color rounded-full px-3'
        >
          <Gmail /> <Text className='font-bold pl-2'>Google</Text>
        </Link>
        <Link
          href='https://mail.yahoo.com/d/search/keyword=corbado.com'
          className='flex items-center email-client h-12 border border-light-color rounded-full px-3'
        >
          <Yahoo /> <Text className='font-bold pl-2'>Yahoo</Text>
        </Link>
        <Link
          href='https://outlook.office.com/mail/0/inbox'
          className='flex items-center email-client h-12 border border-light-color rounded-full px-3'
        >
          <Outlook /> <Text className='font-bold pl-2'>Outlook</Text>
        </Link>
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
        {t('generic.continue')}
      </Button>
      <Button
        type='button'
        onClick={handleCancel}
        variant='tertiary'
        disabled={loading}
      >
        {t('generic.cancel')}
      </Button>
    </>
  );
};
