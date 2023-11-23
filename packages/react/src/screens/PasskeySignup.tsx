import { FlowHandlerEvents, useCorbado } from '@corbado/react-sdk';
import React, { useCallback, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type { ButtonType } from '../components';
import { PasskeyScreensWrapper } from '../components/PasskeyScreensWrapper';
import useFlowHandler from '../hooks/useFlowHandler';
import useUserData from '../hooks/useUserData';

export const PasskeySignup = () => {
  const { t } = useTranslation();
  const { navigateNext, navigateBack } = useFlowHandler();
  const { signUpWithPasskey } = useCorbado();
  const { email, userName } = useUserData();

  const header = useMemo(
    () => (
      <Trans i18nKey='passkey_signup.header'>
        text <span className='text-primary-color underline'>x</span> text
      </Trans>
    ),
    [t],
  );

  const subHeader = useMemo(
    () => (
      <Trans i18nKey='passkey_signup.sub-header'>
        text <span className='text-secondary-font-color'>{email}</span> text
      </Trans>
    ),
    [t],
  );

  const primaryButton = useMemo(() => t('passkey_signup.primary_btn'), [t]);
  const secondaryButton = useMemo(() => t('passkey_signup.secondary_btn'), [t]);
  const tertiaryButton = useMemo(() => t('passkey_signup.tertiary_btn'), [t]);

  const handleCreateAccount = useCallback(async () => {
    if (!email || !userName) {
      return;
    }

    try {
      await signUpWithPasskey(email, userName);
      return navigateNext(FlowHandlerEvents.PasskeySuccess);
    } catch (e) {
      return navigateNext(FlowHandlerEvents.PasskeyError);
    }
  }, [email, navigateNext, signUpWithPasskey, userName]);

  const handleSendOtp = useCallback(() => {
    return navigateNext(FlowHandlerEvents.EmailOtp);
  }, [navigateNext]);

  const handleBack = useCallback(() => {
    return navigateBack();
  }, [navigateBack]);

  const handleClick = useCallback(
    (btn: ButtonType) => {
      if (btn === 'primary') {
        return handleCreateAccount();
      }

      if (btn === 'secondary') {
        return handleSendOtp();
      }

      return handleBack();
    },
    [handleBack, handleCreateAccount, handleSendOtp],
  );

  const props = useMemo(
    () => ({
      header,
      subHeader,
      primaryButton,
      showHorizontalRule: true,
      secondaryButton,
      tertiaryButton,
      onClick: handleClick,
    }),
    [header, subHeader, primaryButton, secondaryButton, tertiaryButton, handleClick],
  );

  return (
    <>
      <PasskeyScreensWrapper {...props} />
    </>
  );
};
