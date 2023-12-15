import { useCorbado } from '@corbado/react-sdk';
import { FlowHandlerEvents, makeApiCallWithErrorHandler } from '@corbado/shared-ui';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { ButtonType, PasskeyScreensWrapperProps } from '../../components';
import { PasskeyScreensWrapper } from '../../components';
import useFlowHandler from '../../hooks/useFlowHandler';
import useUserData from '../../hooks/useUserData';

export const PasskeySignup = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'authenticationFlows.signup.passkey' });
  const { t: tErrors } = useTranslation('translation', { keyPrefix: 'errors' });
  const { navigateNext, navigateBack } = useFlowHandler();
  const { signUpWithPasskey } = useCorbado();
  const { email, userName, setEmailError } = useUserData();
  const [loading, setLoading] = useState<boolean>(false);

  const header = useMemo(
    () => (
      <span>
        {t('header')}
        <span
          className='cb-link-primary'
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
        {t('body')} <span className='cb-text-secondary'>{email}</span>.
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

    setLoading(true);

    await makeApiCallWithErrorHandler(
      () => signUpWithPasskey(email, userName),
      () => navigateNext(FlowHandlerEvents.PasskeySuccess),
      error => {
        if (error.name === 'InvalidUserInputError') {
          setEmailError(tErrors('serverError_unreachableEmail'));
          navigateBack();
          return;
        }

        return navigateNext(FlowHandlerEvents.PasskeyError);
      },
    );
  }, [email, userName, navigateBack, navigateNext, setEmailError, tErrors]);

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
      loading,
      onClick: handleClick,
    }),
    [header, subHeader, primaryButton, secondaryButton, tertiaryButton, loading, handleClick],
  );

  return (
    <>
      <PasskeyScreensWrapper {...props} />
    </>
  );
};
