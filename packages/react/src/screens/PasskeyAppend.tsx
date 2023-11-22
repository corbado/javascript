import { useCorbado } from '@corbado/react-sdk';
import { FlowHandlerEvents } from '@corbado/web-core';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type { ButtonType } from '../components/PasskeyScreensWrapper';
import { PasskeyScreensWrapper } from '../components/PasskeyScreensWrapper';
import useFlowHandler from '../hooks/useFlowHandler';

export const PasskeyAppend = () => {
  const { t } = useTranslation();
  const { navigateNext } = useFlowHandler();
  const { appendPasskey } = useCorbado();

  const header = (
    <Trans i18nKey='activate_passkey.header'>
      text <span className='text-primary-color underline'>x</span>
    </Trans>
  );

  const primaryButton = t('activate_passkey.primary_btn');
  const secondaryButton = t('activate_passkey.secondary_btn');

  const handlePasskeyActivation = async () => {
    try {
      await appendPasskey();
      return navigateNext(FlowHandlerEvents.PasskeySuccess);
    } catch (e) {
      return navigateNext(FlowHandlerEvents.PasskeyError);
    }
  };
  const handleLater = () => navigateNext(FlowHandlerEvents.MaybeLater);

  const handleClick = (btn: ButtonType) => {
    if (btn === 'primary') {
      return handlePasskeyActivation();
    }

    return handleLater();
  };

  const props = {
    header,
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
