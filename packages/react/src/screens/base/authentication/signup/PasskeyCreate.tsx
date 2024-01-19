import { FlowHandlerEvents } from '@corbado/shared-ui';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { ButtonVariants, PasskeyScreensBaseProps } from '../../../../components';
import { PasskeyScreensBase } from '../../../../components';
import useFlowHandler from '../../../../hooks/useFlowHandler';

export const PasskeyCreate = () => {
  const { navigateBack, currentUserState, emitEvent, currentVerificationMethod } = useFlowHandler();
  const { t } = useTranslation('translation', {
    keyPrefix: `authentication.signup.passkeyCreate`,
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
          {t('headerButton_showPasskeyBenefits')}
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
  const secondaryButton = useMemo(() => t(`button_switchToAlternate.${currentVerificationMethod}`), [t]);
  const tertiaryButton = useMemo(() => t('button_back'), [t]);

  const handleBack = useCallback(() => {
    return navigateBack();
  }, [navigateBack]);

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
          return navigateBack();
      }

      return;
    },
    [handleBack],
  );

  const props: PasskeyScreensBaseProps = useMemo(
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
      <PasskeyScreensBase {...props} />
    </>
  );
};
