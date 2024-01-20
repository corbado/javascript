import { useCorbado } from '@corbado/react-sdk';
import { FlowHandlerEvents } from '@corbado/shared-ui';
import type { FC } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import useFlowHandler from '../../hooks/useFlowHandler';
import type { ButtonVariants } from '../ui';
import type { PasskeyScreensBaseProps } from './PasskeyScreensBase';
import { PasskeyScreensBase } from './PasskeyScreensBase';

export interface PasskeyErrorBaseProps {
  showSecondaryButton?: boolean;
  navigateBackOnCancel?: boolean;
}

export const PasskeyErrorBase: FC<PasskeyErrorBaseProps> = ({ showSecondaryButton, navigateBackOnCancel }) => {
  const { navigateBack, emitEvent, currentFlowType, currentVerificationMethod } = useFlowHandler();
  const { t } = useTranslation('translation', {
    keyPrefix: `authentication.${currentFlowType}.passkeyError`,
  });
  const { shortSession } = useCorbado();
  const [primaryLoading, setPrimaryLoading] = useState<boolean>(false);
  const [secondaryLoading, setSecondaryLoading] = useState<boolean>(false);

  const header = useMemo(() => t('header'), [t]);

  const body = useMemo(() => {
    if (currentFlowType === 'login') {
      return t(`body.${currentVerificationMethod}`);
    }

    return (
      <span>
        {t('body_errorMessage')}
        <span
          className='cb-link-primary'
          onClick={() => void emitEvent(FlowHandlerEvents.ShowBenefits)}
        >
          {t('button_showPasskeyBenefits')}
        </span>
        {t(`body_tryAgainMessage.${currentVerificationMethod}`)}
      </span>
    );
  }, [t]);

  const primaryButton = useMemo(() => t('button_retry'), [t]);
  const secondaryButton = useMemo(() => {
    if (!showSecondaryButton) {
      return '';
    }

    return t(`button_switchToAlternate.${currentVerificationMethod}`);
  }, [t]);
  const tertiaryButton = useMemo(() => {
    if (navigateBackOnCancel) {
      return t('button_back');
    }

    return t('button_cancel');
  }, [t, shortSession]);

  const handleClick = useCallback(
    (btn: ButtonVariants) => {
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

      return;
    },
    [navigateBack, emitEvent],
  );

  const props: PasskeyScreensBaseProps = useMemo(
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
      <PasskeyScreensBase {...props} />
    </>
  );
};
