import { useCorbado } from '@corbado/react-sdk';
import { FlowHandlerEvents } from '@corbado/web-core';
import React, { useCallback, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type { ButtonType } from '../components/PasskeyScreensWrapper';
import { PasskeyScreensWrapper } from '../components/PasskeyScreensWrapper';
import useFlowHandler from '../hooks/useFlowHandler';

export const PasskeyAppend = () => {
  const { t } = useTranslation();
  const { navigateNext } = useFlowHandler();
  const { appendPasskey } = useCorbado();

  const header = useMemo(
    () => (
      <Trans i18nKey='activate_passkey.header'>
        text <span className='text-primary-color underline'>x</span>
      </Trans>
    ),
    [t],
  );

  const primaryButton = useMemo(() => t('activate_passkey.primary_btn'), [t]);
  const secondaryButton = useMemo(() => t('activate_passkey.secondary_btn'), [t]);

  const handlePasskeyActivation = useCallback(async () => {
    try {
      await appendPasskey();
      return navigateNext(FlowHandlerEvents.PasskeySuccess);
    } catch (e) {
      return navigateNext(FlowHandlerEvents.PasskeyError);
    }
  }, [appendPasskey, navigateNext]);

  const handleLater = useCallback(() => navigateNext(FlowHandlerEvents.MaybeLater), [navigateNext]);

  const handleClick = useCallback(
    (btn: ButtonType) => {
      if (btn === 'primary') {
        return handlePasskeyActivation();
      }

      return handleLater();
    },
    [handleLater, handlePasskeyActivation],
  );

  const props = useMemo(
    () => ({
      header,
      primaryButton,
      secondaryButton,
      onClick: handleClick,
    }),
    [header, primaryButton, secondaryButton, handleClick],
  );

  return (
    <>
      <PasskeyScreensWrapper {...props} />
    </>
  );
};
