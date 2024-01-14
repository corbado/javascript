import { useCorbado } from '@corbado/react-sdk';
import { FlowHandlerEvents } from '@corbado/shared-ui';
import type { FC } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { ButtonType, PasskeyScreensWrapperProps } from '../../components';
import { PasskeyScreensWrapper } from '../../components';
import useFlowHandler from '../../hooks/useFlowHandler';

export interface PasskeyErrorProps {
  showSecondaryButton?: boolean;
  navigateBackOnCancel?: boolean;
}

export const PasskeyError: FC<PasskeyErrorProps> = ({ showSecondaryButton, navigateBackOnCancel }) => {
  const { navigateBack, emitEvent, currentFlow } = useFlowHandler();
  const { t } = useTranslation('translation', {
    keyPrefix: `authentication.${currentFlow}.passkeyError`,
  });
  const { shortSession } = useCorbado();
  const [primaryLoading, setPrimaryLoading] = useState<boolean>(false);
  const [secondaryLoading, setSecondaryLoading] = useState<boolean>(false);

  const header = useMemo(() => t('header'), [t]);

  const body = useMemo(
    () => (
      <span>
        {t('body_errorMessage1')}
        <span
          className='cb-link-primary'
          onClick={() => void emitEvent(FlowHandlerEvents.ShowBenefits)}
        >
          {t('button_showPasskeyBenefits')}
        </span>
        {t('body_errorMessage2')}
      </span>
    ),
    [t],
  );

  const primaryButton = useMemo(() => t('button_retry'), [t]);
  const secondaryButton = useMemo(() => {
    if (!showSecondaryButton) {
      return '';
    }

    return t('button_emailOtp');
  }, [t]);
  const tertiaryButton = useMemo(() => {
    if (navigateBackOnCancel) {
      return t('button_back');
    }

    return t('button_cancel');
  }, [t, shortSession]);

  const handleClick = useCallback(
    (btn: ButtonType) => {
      switch (btn) {
        case 'primary':
          setPrimaryLoading(true);
          return emitEvent(FlowHandlerEvents.PrimaryButton);
        case 'secondary':
          setSecondaryLoading(true);
          return emitEvent(FlowHandlerEvents.SecondaryButton);
        case 'tertiary':
          return navigateBackOnCancel ? navigateBack() : emitEvent(FlowHandlerEvents.CancelPasskey);
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
      primaryLoading,
      secondaryLoading,
      onClick: handleClick,
    }),
    [body, handleClick, header, primaryButton, secondaryButton, primaryLoading, secondaryButton, tertiaryButton],
  );

  return (
    <>
      <PasskeyScreensWrapper {...props} />
    </>
  );
};
