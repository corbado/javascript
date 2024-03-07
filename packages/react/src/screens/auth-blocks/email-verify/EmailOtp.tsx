import type { EmailVerifyBlock } from '@corbado/shared-ui';
import React, { useCallback, useEffect, useRef, useState } from 'react';

// import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '../../../components/ui2/buttons/PrimaryButton';
import { EmailLinks } from '../../../components/ui2/EmailLinks';
import { OtpInputGroup } from '../../../components/ui2/input/OtpInputGroup';
import { Header } from '../../../components/ui2/typography/Header';
import { Text } from '../../../components/ui2/typography/Text';
import { UserInfo } from '../../../components/ui2/UserInfo';

export const EmailOtp = ({ block }: { block: EmailVerifyBlock }) => {
  // const { t } = useTranslation('translation', { keyPrefix: `${block.authType}.email-verify.email-otp` });
  const [loading, setLoading] = useState<boolean>(false);
  const otpRef = useRef<string>('');

  useEffect(() => {
    setLoading(false);
  }, [block]);

  // const header = t('header');
  // const body = (
  //   <>
  //     {t('body_text1')}
  //     <span className='cb-text-secondary cb-text-bold'>{block.data.email}</span>
  //     {t('body_text2')}
  //   </>
  // );
  // const resendButtonText = t('button_resend');

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
    <div className='cb-email-otp-block-2'>
      <Header className='cb-email-otp-block-header-2'>Enter code to create account</Header>
      <UserInfo
        className='cb-email-otp-user-info-section-2'
        userData={block.data.email}
      ></UserInfo>
      <Text
        level='2'
        fontWeight='bold'
        fontFamilyVariant='secondary'
        className='cb-row-2'
      >
        One-time passcode
      </Text>
      <Text fontFamilyVariant='secondary'>Enter the one-time passcode sent to your email address</Text>
      <OtpInputGroup
        emittedOTP={handleOtpChange}
        error={block.data.translatedError}
      />
      <EmailLinks className='cb-email-otp-buton-group-2' />
      <Text
        fontWeight='bold'
        fontFamilyVariant='secondary'
        className='cb-email-otp-resend-text-2'
      >
        Didn't receive the code?
      </Text>
      <PrimaryButton
        className='cb-email-otp-resend-button-2'
        isLoading={loading}
        onClick={() => void block.resendCode()}
      >
        Resend code
      </PrimaryButton>
    </div>
  );
};
