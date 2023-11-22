import { FlowHandlerEvents, useCorbado } from '@corbado/react-sdk';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type { ButtonType } from '../components/PasskeyScreensWrapper';
import { PasskeyScreensWrapper } from '../components/PasskeyScreensWrapper';
import useFlowHandler from '../hooks/useFlowHandler';
import useUserData from '../hooks/useUserData';

export const PasskeyBenefits = () => {
  const { t } = useTranslation();
  const { email, userName } = useUserData();
  const { signUpWithPasskey, shortSession, appendPasskey } = useCorbado();
  const { navigateNext } = useFlowHandler();

  const header = t('create_passkey.header');
  const body = (
    <Trans i18nKey='create_passkey.body'>
      With passkeys, you don’t need to remember complex passwords anymore. Log in securely to using{' '}
      <strong>Face ID, Touch ID or screen lock code</strong>.
    </Trans>
  );

  const primaryButton = t('create_passkey.primary_btn');
  const secondaryButton = t('create_passkey.secondary_btn');

  const handleCreatePasskey = async () => {
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
  };

  const handleBack = () => {
    return navigateNext(FlowHandlerEvents.MaybeLater, {
      isUserAuthenticated: !!shortSession,
    });
  };

  const handleClick = async (btn: ButtonType) => {
    if (btn === 'primary') {
      return handleCreatePasskey();
    }

    return handleBack();
  };

  const props = {
    header,
    body,
    primaryButton,
    secondaryButton,
    onClick: handleClick,
  };

  return (
    <>
      <PasskeyScreensWrapper {...props} />
    </>
  );
};
