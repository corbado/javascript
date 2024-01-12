import { FlowHandlerEvents } from '@corbado/shared-ui';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { ButtonType, PasskeyScreensWrapperProps } from '../../components';
import { PasskeyScreensWrapper } from '../../components';
import useFlowHandler from '../../hooks/useFlowHandler';

export const PasskeyBenefits = () => {
  const { navigateBack, emitEvent, currentFlow } = useFlowHandler();
  const { t } = useTranslation('translation', {
    keyPrefix: `authenticationFlows.signup.${currentFlow}.passkeyBenefits`,
  });
  const [primaryLoading, setPrimaryLoading] = useState<boolean>(false);
  const [secondaryLoading, setSecondaryLoading] = useState<boolean>(false);

  const header = useMemo(() => t('header'), [t]);
  const body = useMemo(
    () => (
      <>
        {t('body_introduction')} <strong>{t('body_loginMethods')}</strong>
      </>
    ),
    [t],
  );

  const primaryButton = useMemo(() => t('button_start'), [t]);
  const secondaryButton = useMemo(() => t('button_skip'), [t]);

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
    [navigateBack, emitEvent],
  );

  const props: PasskeyScreensWrapperProps = useMemo(
    () => ({
      header,
      body,
      primaryButton,
      secondaryButton,
      primaryLoading,
      secondaryLoading,
      onClick: handleClick,
    }),
    [body, header, primaryButton, secondaryButton, primaryLoading, secondaryLoading, handleClick],
  );

  return (
    <>
      <PasskeyScreensWrapper {...props} />
    </>
  );
};
