import type { Identifier } from '@corbado/types';
import type { FC, MouseEvent } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Link, LoadingSpinner, OtpInputGroup, Text } from '../../components';
import { useCorbado } from '../../hooks/useCorbado';
import { useCorbadoUserDetails } from '../../hooks/useCorbadoUserDetails';
import { getErrorCode } from '../../util';

interface Props {
  identifier: Identifier;
  onCancel: () => void;
}

const IdentifierVerifyDialog: FC<Props> = ({ identifier, onCancel }) => {
  const { t } = useTranslation('translation');

  const { verifyIdentifierFinish, verifyIdentifierStart } = useCorbado();

  const { getCurrentUser } = useCorbadoUserDetails();

  const [loading, setLoading] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>();
  const timer = useRef<NodeJS.Timeout>();

  const getHeading = () => {
    switch (identifier.type) {
      case 'email':
        return t('user-details.email_verify.header');
      case 'phone':
        return t('user-details.phone_verify.header');
      default:
        return '';
    }
  };

  const getBody = () => {
    switch (identifier.type) {
      case 'email':
        return t('user-details.email_verify.body');
      case 'phone':
        return t('user-details.phone_verify.body');
      default:
        return '';
    }
  };

  const getResend = () => {
    switch (identifier.type) {
      case 'email':
        return t('user-details.email_verify.link', { counter: remainingTime });
      case 'phone':
        return t('user-details.phone_verify.link', { counter: remainingTime });
      default:
        return '';
    }
  };

  useEffect(() => {
    setLoading(false);

    void resendEmailVerification();

    const timer = startTimer();

    return () => clearInterval(timer);
  }, []);

  const finishEmailVerification = async (emailChallengeCode: string) => {
    if (!emailChallengeCode) {
      return;
    }

    const res = await verifyIdentifierFinish(identifier.id, emailChallengeCode);
    if (res.err) {
      const code = getErrorCode(res.val.message);
      if (code) {
        // possible code: invalid_challenge_solution_email-otp
        setErrorMessage(t('user-details.warning_invalid_challenge'));
        console.error(t(`errors.${code}`));
      }
      return;
    }

    void getCurrentUser().then(() => onCancel());
  };

  function startTimer() {
    const newRemainingTime = 30;

    if (newRemainingTime < 1) {
      return;
    }

    setRemainingTime(newRemainingTime);
    timer.current = setInterval(() => setRemainingTime(time => (time > 0 ? time - 1 : time)), 1000);

    return timer.current;
  }

  const handleOtpChange = useCallback((userOtp: string[]) => {
    const otp = userOtp.join('');
    if (otp.length !== 6) {
      return;
    }

    setLoading(true);
    void finishEmailVerification(otp).finally(() => setLoading(false));
  }, []);

  const resendEmailVerification = async (e?: MouseEvent<HTMLAnchorElement>) => {
    e?.preventDefault();

    if (remainingTime > 0) {
      return;
    }

    setErrorMessage(undefined);

    const res = await verifyIdentifierStart(identifier.id);

    if (res.err) {
      const code = getErrorCode(res.val.message);
      if (code) {
        console.error(t(`errors.${code}`));
      }
      return;
    }

    setRemainingTime(30);
  };

  return (
    <div className='cb-user-details-verify-identifier-container'>
      <Text
        level='3'
        fontWeight='bold'
      >
        {getHeading()}
      </Text>
      <Text
        level='2'
        textColorVariant='secondary'
        className='cb-truncate'
      >
        {identifier.value}
      </Text>
      <Text
        level='2'
        fontFamilyVariant='secondary'
      >
        {getBody()}
      </Text>
      <div className='cb-otp-inputs-container'>
        <OtpInputGroup
          emittedOTP={handleOtpChange}
          loading={loading}
          error={errorMessage}
          showErrorMessage={Boolean(errorMessage)}
        />
        {loading ? (
          <div className='cb-otp-inputs-loader-container'>
            <LoadingSpinner className='cb-otp-inputs-loader' />
          </div>
        ) : (
          <div className='cb-otp-inputs-placeholder' />
        )}
      </div>
      <Link
        href={'#'}
        className='cb-text-1 cb-normal-text-weight'
        onClick={e => void resendEmailVerification(e)}
      >
        {getResend()}
      </Link>
      <Button
        className='cb-user-details-verify-identifier-button-cancel'
        onClick={onCancel}
      >
        <Text
          level='3'
          fontWeight='bold'
          className='cb-secondary-link'
        >
          {t('user-details.cancel')}
        </Text>
      </Button>
    </div>
  );
};

export default IdentifierVerifyDialog;
