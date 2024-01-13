import { useCorbado } from '@corbado/react-sdk';
import { FlowHandlerEvents } from '@corbado/shared-ui';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { ButtonType, PasskeyScreensWrapperProps } from '../../components';
import { PasskeyScreensWrapper } from '../../components';
import useFlowHandler from '../../hooks/useFlowHandler';

export const PasskeyError = () => {
  const { navigateBack, emitEvent, currentFlowStyle } = useFlowHandler();
  const { t } = useTranslation('translation', {
    keyPrefix: `authenticationFlows.login.${currentFlowStyle}.passkeyError`,
  });
  const { shortSession } = useCorbado();
  const [loading, setLoading] = useState<boolean>(false);

  const header = useMemo(() => t('header'), [t]);

  const body = useMemo(() => t('body'), [t]);

  const primaryButton = useMemo(() => t('button_retry'), [t]);
  const secondaryButton = useMemo(() => {
    if (shortSession) {
      return '';
    }

    return t('button_emailOtp');
  }, [t]);
  const tertiaryButton = useMemo(() => {
    if (shortSession) {
      return t('button_cancel');
    }

    return t('button_back');
  }, [t, shortSession]);

  const handleClick = useCallback(
    (btn: ButtonType) => {
      switch (btn) {
        case 'primary':
          setLoading(true);
          return emitEvent(FlowHandlerEvents.PrimaryButton);
        case 'secondary':
          return emitEvent(FlowHandlerEvents.SecondaryButton);
        case 'tertiary':
          return navigateBack();
      }
    },
    [navigateBack, emitEvent],
  );

  const props: PasskeyScreensWrapperProps = useMemo(
    () => ({
      header,
      body,
      primaryButton,
      secondaryButton,
      tertiaryButton,
      primaryLoading: loading,
      onClick: handleClick,
    }),
    [body, handleClick, header, primaryButton, secondaryButton, loading, tertiaryButton],
  );

  return (
    <>
      <PasskeyScreensWrapper {...props} />
    </>
  );
};
