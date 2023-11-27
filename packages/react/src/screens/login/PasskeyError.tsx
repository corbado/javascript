import { FlowHandlerEvents, SignUpFlowNames, useCorbado } from '@corbado/react-sdk';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { ButtonType } from '../../components/PasskeyScreensWrapper';
import { PasskeyScreensWrapper } from '../../components/PasskeyScreensWrapper';
import useFlowHandler from '../../hooks/useFlowHandler';
import useUserData from '../../hooks/useUserData';

export const PasskeyError = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'login.passkeyError' });
  const { signUpWithPasskey, loginWithPasskey, shortSession } = useCorbado();
  const { currentFlow, navigateBack, navigateNext } = useFlowHandler();
  const { email, userName } = useUserData();

  const header = useMemo(() => t('header'), [t]);

  const body = useMemo(() => t('body'), [t]);

  const primaryButton = useMemo(() => t('button_retry'), [t]);
  const secondaryButton = useMemo(() => {
    if (shortSession) {
      return '';
    }

    return t('button_emailOtp');
  }, [t]);
  const tertiaryButton = useMemo(() => {
    if (shortSession) {
      return t('button_cancel');
    }

    return t('button_back');
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
      switch (btn) {
        case 'primary':
          return handleCreatePasskey();
        case 'secondary':
          return handleSendOtp();
        case 'tertiary':
          return handleBack();
      }
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
