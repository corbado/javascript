import { FlowHandlerEvents } from '@corbado/shared-ui';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { ButtonType, PasskeyScreensWrapperProps } from '../../../../components';
import { PasskeyScreensWrapper } from '../../../../components';
import useFlowHandler from '../../../../hooks/useFlowHandler';

export const PasskeyCreate = () => {
  const { navigateBack, currentUserState, emitEvent, currentFlow } = useFlowHandler();
  const { t } = useTranslation('translation', {
    keyPrefix: `authentication.${currentFlow}.passkeyCreate`,
  });
  const [primaryLoading, setPrimaryLoading] = useState<boolean>(false);
  const [secondaryLoading, setSecondaryLoading] = useState<boolean>(false);

  useEffect(() => {
    setPrimaryLoading(false);
    setSecondaryLoading(false);
  }, [currentUserState]);

  const header = useMemo(
    () => (
      <span>
        {t('header')}
        <span
          className='cb-link-primary'
          onClick={() => void emitEvent(FlowHandlerEvents.ShowBenefits)}
        >
          {t('button_showPasskeyBenefits')}
        </span>
      </span>
    ),
    [t],
  );

  const subHeader = useMemo(
    () => (
      <span>
        {t('body')} <span className='cb-text-secondary'>{currentUserState.email}</span>.
      </span>
    ),
    [t],
  );

  const primaryButton = useMemo(() => t('button_start'), [t]);
  const secondaryButton = useMemo(() => t('button_emailOtp'), [t]);
  const tertiaryButton = useMemo(() => t('button_back'), [t]);

  const handleBack = useCallback(() => {
    return navigateBack();
  }, [navigateBack]);

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
          return navigateBack();
      }
    },
    [handleBack],
  );

  const props: PasskeyScreensWrapperProps = useMemo(
    () => ({
      header,
      subHeader,
      primaryButton,
      showHorizontalRule: true,
      secondaryButton,
      tertiaryButton,
      primaryLoading,
      secondaryLoading,
      onClick: handleClick,
    }),
    [header, subHeader, primaryButton, secondaryButton, tertiaryButton, primaryLoading, secondaryLoading, handleClick],
  );

  return (
    <>
      <PasskeyScreensWrapper {...props} />
    </>
  );
};
