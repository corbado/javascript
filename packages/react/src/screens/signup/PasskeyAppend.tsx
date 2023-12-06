import { useCorbado } from '@corbado/react-sdk';
import { FlowHandlerEvents } from '@corbado/web-core';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { ButtonType, PasskeyScreensWrapperProps } from '../../components';
import { PasskeyScreensWrapper } from '../../components';
import useFlowHandler from '../../hooks/useFlowHandler';

export const PasskeyAppend = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'common.passkeyPrompt' });
  const { navigateNext } = useFlowHandler();
  const { appendPasskey } = useCorbado();

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

  const primaryButton = useMemo(() => t('button_start'), [t]);
  const secondaryButton = useMemo(() => t('button_skip'), [t]);

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

  const props: PasskeyScreensWrapperProps = useMemo(
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
