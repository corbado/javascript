import { FlowHandlerEvents, SignUpFlowNames, useCorbado } from '@corbado/react-sdk';
import React, { useCallback, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type { ButtonType } from '../components/PasskeyScreensWrapper';
import { PasskeyScreensWrapper } from '../components/PasskeyScreensWrapper';
import useFlowHandler from '../hooks/useFlowHandler';
import useUserData from '../hooks/useUserData';

export const PasskeyError = () => {
  const { t } = useTranslation();
  const { signUpWithPasskey, loginWithPasskey, shortSession } = useCorbado();
  const { currentFlow, navigateBack, navigateNext } = useFlowHandler();
  const { email, userName } = useUserData();

  const header = useMemo(() => t('create_passkey_error.header'), [t]);

  const body = useMemo(
    () => (
      <Trans i18nKey='create_passkey_error.body'>
        Creating your account with <strong className='text-primary-color underline'>passkeys</strong> not possible. Try
        again or log in with email one time code.
      </Trans>
    ),
    [t],
  );

  const primaryButton = useMemo(() => t('create_passkey_error.primary_btn'), [t]);
  const secondaryButton = useMemo(() => {
    if (shortSession) {
      return '';
    }

    return t('create_passkey_error.secondary_btn');
  }, [t]);
  const tertiaryButton = useMemo(() => {
    if (shortSession) {
      return t('generic.cancel');
    }

    return t('create_passkey_error.tertiary_btn');
  }, [t, shortSession]);

  const handleCreatePasskey = useCallback(async () => {
    if (!email) {
      navigateBack();
      return;
    }

    if (currentFlow === SignUpFlowNames.PasskeySignupWithEmailOTPFallback) {
      await signUpWithPasskey(email, userName ?? '');
    } else {
      await loginWithPasskey(email);
    }

    void navigateNext(FlowHandlerEvents.PasskeySuccess);
  }, [currentFlow, email, loginWithPasskey, navigateBack, navigateNext, signUpWithPasskey, userName]);

  const handleSendOtp = useCallback(() => {
    void navigateNext(FlowHandlerEvents.EmailOtp);
  }, [navigateNext]);

  const handleBack = useCallback(() => {
    if (shortSession) {
      void navigateNext(FlowHandlerEvents.CancelPasskey);
      return;
    }

    navigateBack();
  }, [navigateBack, navigateNext, shortSession]);

  const handleClick = useCallback(
    (btn: ButtonType) => {
      if (btn === 'primary') {
        void handleCreatePasskey();
      }

      if (btn === 'secondary') {
        handleSendOtp();
      }

      handleBack();
    },
    [handleBack, handleCreatePasskey, handleSendOtp],
  );

  const props = useMemo(
    () => ({
      header,
      body,
      primaryButton,
      secondaryButton,
      tertiaryButton,
      onClick: handleClick,
    }),
    [body, handleClick, header, primaryButton, secondaryButton, tertiaryButton],
  );

  return (
    <>
      <PasskeyScreensWrapper {...props} />
    </>
  );
};
