import { FlowHandlerEvents } from '@corbado/shared-ui';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { ButtonType, PasskeyScreensWrapperProps } from '../../components';
import { PasskeyScreensWrapper } from '../../components';
import useFlowHandler from '../../hooks/useFlowHandler';

export const PasskeyBenefits = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'authenticationFlows.login.passkeyBenefits' });
  const { emitEvent } = useFlowHandler();
  const [loading, setLoading] = useState<boolean>(false);

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
    async (btn: ButtonType) => {
      if (btn === 'primary') {
        setLoading(true);
        return emitEvent(FlowHandlerEvents.PrimaryButton);
      }

      return emitEvent(FlowHandlerEvents.SecondaryButton);
    },
    [emitEvent, setLoading],
  );

  const props: PasskeyScreensWrapperProps = useMemo(
    () => ({
      header,
      body,
      primaryButton,
      secondaryButton,
      primaryLoading: loading,
      onClick: handleClick,
    }),
    [body, header, primaryButton, secondaryButton, loading, handleClick],
  );

  console.log('PasskeyBenefits props', props)
  return (
    <>
      <PasskeyScreensWrapper {...props} />
    </>
  );
};
