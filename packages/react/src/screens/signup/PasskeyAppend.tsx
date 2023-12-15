import { useCorbado } from '@corbado/react-sdk';
import { FlowHandlerEvents, makeApiCallWithErrorHandler } from '@corbado/shared-ui';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { ButtonType, PasskeyScreensWrapperProps } from '../../components';
import { PasskeyScreensWrapper } from '../../components';
import useFlowHandler from '../../hooks/useFlowHandler';

export const PasskeyAppend = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'authenticationFlows.signup.passkeyPrompt' });
  const { navigateNext } = useFlowHandler();
  const { appendPasskey } = useCorbado();
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

  const primaryButton = useMemo(() => t('button_start'), [t]);
  const secondaryButton = useMemo(() => t('button_skip'), [t]);

  const handlePasskeyActivation = useCallback(async () => {
    setLoading(true);

    await makeApiCallWithErrorHandler(
      appendPasskey,
      () => navigateNext(FlowHandlerEvents.PasskeySuccess),
      () => navigateNext(FlowHandlerEvents.PasskeyError),
    );
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
      loading,
    }),
    [header, primaryButton, secondaryButton, loading, handleClick],
  );

  return (
    <>
      <PasskeyScreensWrapper {...props} />
    </>
  );
};
