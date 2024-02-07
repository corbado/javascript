import { useCorbado } from '@corbado/react-sdk';
import { FlowHandlerEvents } from '@corbado/shared-ui';
import type { FC } from 'react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import useFlowHandler from '../../hooks/useFlowHandler';
import type { ButtonVariants } from '../ui';
import { PasskeyScreensBase } from './PasskeyScreensBase';

export interface PasskeyErrorBaseProps {
  showSecondaryButton?: boolean;
  navigateBackOnCancel?: boolean;
}

export const PasskeyErrorBase: FC<PasskeyErrorBaseProps> = ({ showSecondaryButton, navigateBackOnCancel }) => {
  const { navigateBack, emitEvent, currentFlowType, currentVerificationMethod, currentUserState } = useFlowHandler();
  const { t } = useTranslation('translation', {
    keyPrefix: `authentication.${currentFlowType}.passkeyError`,
  });
  const { isAuthenticated } = useCorbado();
  const [primaryLoading, setPrimaryLoading] = useState<boolean>(false);
  const [secondaryLoading, setSecondaryLoading] = useState<boolean>(false);

  useEffect(() => {
    setPrimaryLoading(false);
  }, [currentUserState.lastPasskeyRetryTimeStamp]);

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
  }, [t, isAuthenticated]);

  const handleClick = useCallback(
    (btn: ButtonVariants) => {
      switch (btn) {
        case 'primary':
          setPrimaryLoading(true);
          return void emitEvent(FlowHandlerEvents.PrimaryButton);
        case 'secondary':
          setSecondaryLoading(true);
          return void emitEvent(FlowHandlerEvents.SecondaryButton);
        case 'tertiary':
          return navigateBackOnCancel ? navigateBack() : void emitEvent(FlowHandlerEvents.CancelPasskey);
      }

      return;
    },
    [navigateBack, emitEvent],
  );

  const passkeyScreensBase = useMemo(
    () => (
      <PasskeyScreensBase
        header={header}
        body={body}
        primaryButton={primaryButton}
        secondaryButton={secondaryButton}
        tertiaryButton={tertiaryButton}
        onClick={handleClick}
        primaryLoading={primaryLoading}
        secondaryLoading={secondaryLoading}
      />
    ),
    [body, handleClick, header, primaryButton, secondaryButton, primaryLoading, secondaryButton, tertiaryButton],
  );

  return passkeyScreensBase;
};
