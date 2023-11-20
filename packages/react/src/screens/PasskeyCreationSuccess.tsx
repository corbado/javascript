import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { PasscodeScreensWrapper } from '../components/PasscodeScreensWrapper';
import useFlowHandler from '../hooks/useFlowHandler';

export const PasskeyCreationSuccess = () => {
  const { t } = useTranslation();
  const { navigateNext } = useFlowHandler();

  const header = t('create_passkey_success.header');
  const secondaryHeader = t('create_passkey_success.secondary_header');
  const body = (
    <Trans i18nKey='create_passkey_success.body'>
      You can now confirm your identity using your <strong>passkey or via email one time code</strong> when you log in.
    </Trans>
  );

  const primaryButton = t('generic.continue');

  const handleContinue = () => {
    return navigateNext();
  };

  const handleClick = () => {
    handleContinue();
  };

  const props = {
    header,
    secondaryHeader,
    body,
    primaryButton,
    onClick: handleClick,
  };

  return (
    <>
      <PasscodeScreensWrapper {...props} />
    </>
  );
};
