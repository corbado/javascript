import { FlowHandlerEvents, useCorbado } from '@corbado/react-sdk';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { ButtonType, PasskeyScreensWrapperProps } from '../../components';
import { PasskeyScreensWrapper } from '../../components';
import useFlowHandler from '../../hooks/useFlowHandler';
import useUserData from '../../hooks/useUserData';

export const PasskeyError = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'signup.passkeyError' });
  const { signUpWithPasskey, shortSession } = useCorbado();
  const { navigateBack, navigateNext } = useFlowHandler();
  const { email, userName } = useUserData();

  const header = useMemo(() => t('header'), [t]);

  const body = useMemo(
    () => (
      <span>
        {t('body_errorMessage1')}{' '}
        <span
          className='link text-primary-color underline'
          onClick={() => void navigateNext(FlowHandlerEvents.ShowBenefits)}
        >
          {t('button_showPasskeyBenefits')}
        </span>
        {'. '}
        {t('body_errorMessage2')}
      </span>
    ),
    [t],
  );

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

    await signUpWithPasskey(email, userName ?? '');

    void navigateNext(FlowHandlerEvents.PasskeySuccess);
  }, [email, navigateBack, navigateNext, signUpWithPasskey, userName]);

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

  const props: PasskeyScreensWrapperProps = useMemo(
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
