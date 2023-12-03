import { FlowHandlerEvents, useCorbado } from '@corbado/react-sdk';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { ButtonType, PasskeyScreensWrapperProps } from '../../components';
import { PasskeyScreensWrapper } from '../../components';
import useFlowHandler from '../../hooks/useFlowHandler';
import useUserData from '../../hooks/useUserData';

export const PasskeySignup = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'signup.passkey' });
  const { navigateNext, navigateBack } = useFlowHandler();
  const { signUpWithPasskey } = useCorbado();
  const { email, userName } = useUserData();

  const header = useMemo(
    () => (
      <span>
        {t('header')}{' '}
        <span
          className='link text-primary-color underline'
          onClick={() => void navigateNext(FlowHandlerEvents.ShowBenefits)}
        >
          {t('button_showPasskeyBenefits')}
        </span>
      </span>
    ),
    [t],
  );

  const subHeader = useMemo(
    () => (
      <span>
        {t('body')} <span className='text-primary-color'>{email}</span>.
      </span>
    ),
    [t],
  );

  const primaryButton = useMemo(() => t('button_start'), [t]);
  const secondaryButton = useMemo(() => t('button_emailOtp'), [t]);
  const tertiaryButton = useMemo(() => t('button_back'), [t]);

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
      switch (btn) {
        case 'primary':
          return handleCreateAccount();
        case 'secondary':
          return handleSendOtp();
        case 'tertiary':
          return handleBack();
      }
    },
    [handleBack, handleCreateAccount, handleSendOtp],
  );

  const props: PasskeyScreensWrapperProps = useMemo(
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
