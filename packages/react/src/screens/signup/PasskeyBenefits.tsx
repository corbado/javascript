import { FlowHandlerEvents, useCorbado } from '@corbado/react-sdk';
import React, { useCallback, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type { ButtonType } from '../../components/PasskeyScreensWrapper';
import { PasskeyScreensWrapper } from '../../components/PasskeyScreensWrapper';
import useFlowHandler from '../../hooks/useFlowHandler';
import useUserData from '../../hooks/useUserData';

export const PasskeyBenefits = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'signup.passkeyBenefits' });
  const { email, userName } = useUserData();
  const { signUpWithPasskey, shortSession, appendPasskey } = useCorbado();
  const { navigateNext } = useFlowHandler();

  const header = useMemo(() => t('header'), [t]);
  const body = useMemo(
    () => (
      <Trans i18nKey='create_passkey.body'>
        {t('body_introduction')} <strong>{t('body_loginMethods')}</strong>.
      </Trans>
    ),
    [t],
  );

  const primaryButton = useMemo(() => t('button_start'), [t]);
  const secondaryButton = useMemo(() => t('button_skip'), [t]);

  const handleCreatePasskey = useCallback(async () => {
    try {
      if (shortSession) {
        await appendPasskey();
      } else {
        if (!email || !userName) {
          return;
        }

        await signUpWithPasskey(email, userName);
      }

      return navigateNext(FlowHandlerEvents.PasskeySuccess);
    } catch (e) {
      return navigateNext(FlowHandlerEvents.PasskeyError);
    }
  }, [appendPasskey, email, navigateNext, shortSession, signUpWithPasskey, userName]);

  const handleBack = useCallback(() => {
    return navigateNext(FlowHandlerEvents.MaybeLater, {
      isUserAuthenticated: !!shortSession,
    });
  }, [navigateNext, shortSession]);

  const handleClick = useCallback(
    async (btn: ButtonType) => {
      if (btn === 'primary') {
        return handleCreatePasskey();
      }

      return handleBack();
    },
    [handleBack, handleCreatePasskey],
  );

  const props = useMemo(
    () => ({
      header,
      body,
      primaryButton,
      secondaryButton,
      onClick: handleClick,
    }),
    [body, header, primaryButton, secondaryButton, handleClick],
  );

  return (
    <>
      <PasskeyScreensWrapper {...props} />
    </>
  );
};
