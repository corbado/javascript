import React, { useCallback, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { PasskeyScreensWrapper } from '../components/PasskeyScreensWrapper';
import useFlowHandler from '../hooks/useFlowHandler';

export const PasskeyWelcome = () => {
  const { t } = useTranslation();
  const { navigateNext } = useFlowHandler();

  const header = useMemo(() => t('create_passkey_success.header'), [t]);
  const secondaryHeader = useMemo(() => t('create_passkey_success.secondary_header'), [t]);
  const body = useMemo(
    () => (
      <Trans i18nKey='create_passkey_success.body'>
        You can now confirm your identity using your <strong>passkey or via email one time code</strong> when you log
        in.
      </Trans>
    ),
    [t],
  );

  const primaryButton = useMemo(() => t('generic.continue'), [t]);

  const handleClick = useCallback(() => {
    void navigateNext();
  }, [navigateNext]);

  const props = useMemo(
    () => ({
      header,
      secondaryHeader,
      body,
      primaryButton,
      onClick: handleClick,
    }),
    [header, secondaryHeader, body, primaryButton, handleClick],
  );

  return (
    <>
      <PasskeyScreensWrapper {...props} />
    </>
  );
};
