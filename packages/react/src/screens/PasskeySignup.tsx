import { FlowHandlerEvents, useCorbado } from '@corbado/react-sdk';
import React from 'react';
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

  const header = (
    <Trans i18nKey='passkey_signup.header'>
      text <span className='text-primary-color underline'>x</span> text
    </Trans>
  );

  const subHeader = (
    <Trans i18nKey='passkey_signup.sub-header'>
      text <span className='text-secondary-font-color'>{email}</span> text
    </Trans>
  );

  const primaryButton = t('passkey_signup.primary_btn');
  const secondaryButton = t('passkey_signup.secondary_btn');
  const tertiaryButton = t('passkey_signup.tertiary_btn');

  const handleCreateAccount = async () => {
    if (!email || !userName) {
      return;
    }

    try {
      await signUpWithPasskey(email, userName);
      return navigateNext(FlowHandlerEvents.PasskeySuccess);
    } catch (e) {
      return navigateNext(FlowHandlerEvents.PasskeyError);
    }
  };

  const handleSendOtp = () => {
    return navigateNext(FlowHandlerEvents.EmailOtp);
  };

  const handleBack = () => {
    return navigateBack();
  };

  const handleClick = (btn: ButtonType) => {
    if (btn === 'primary') {
      return handleCreateAccount();
    }

    if (btn === 'secondary') {
      return handleSendOtp();
    }

    return handleBack();
  };

  const props = {
    header,
    subHeader,
    primaryButton,
    showHorizontalRule: true,
    secondaryButton,
    tertiaryButton,
    onClick: handleClick,
  };

  return (
    <>
      <PasskeyScreensWrapper {...props} />
    </>
  );
};
