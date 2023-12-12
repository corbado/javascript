import { useCorbado } from '@corbado/react-sdk';
import { FlowHandlerEvents } from '@corbado/shared-ui';
import React, { useCallback, useMemo, useState } from 'react';
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
      loading,
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
