import { useCorbado } from '@corbado/react-sdk';
import { FlowHandlerEvents, makeApiCallWithErrorHandler } from '@corbado/shared-ui';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { ButtonType, PasskeyScreensWrapperProps } from '../../components';
import { PasskeyScreensWrapper } from '../../components';
import useFlowHandler from '../../hooks/useFlowHandler';
import useUserData from '../../hooks/useUserData';

export const PasskeyError = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'authenticationFlows.signup.passkeyError' });
  const { t: tError } = useTranslation('translation', { keyPrefix: 'errors' });
  const { signUpWithPasskey, shortSession } = useCorbado();
  const { navigateBack, navigateNext } = useFlowHandler();
  const { email, userName, setEmailError } = useUserData();
  const [loading, setLoading] = useState<boolean>(false);

  const header = useMemo(() => t('header'), [t]);

  const body = useMemo(
    () => (
      <span>
        {t('body_errorMessage1')}
        <span
          className='cb-link-primary'
          onClick={() => void navigateNext(FlowHandlerEvents.ShowBenefits)}
        >
          {t('button_showPasskeyBenefits')}
        </span>
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
    if (!email || !userName) {
      return void navigateNext(FlowHandlerEvents.InvalidEmail);
    }

    setLoading(true);

    await makeApiCallWithErrorHandler(
      () => signUpWithPasskey(email, userName),
      () => void navigateNext(FlowHandlerEvents.PasskeySuccess),
      error => {
        if (error.name === 'InvalidUserInputError') {
          setEmailError(tError('serverError_unreachableEmail'));
          return void navigateNext(FlowHandlerEvents.InvalidEmail);
        }

        setLoading(false);
      },
    );
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
      loading,
      onClick: handleClick,
    }),
    [body, handleClick, header, primaryButton, secondaryButton, loading, tertiaryButton],
  );

  return (
    <>
      <PasskeyScreensWrapper {...props} />
    </>
  );
};
