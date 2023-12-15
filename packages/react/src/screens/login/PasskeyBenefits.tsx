import { useCorbado } from '@corbado/react-sdk';
import { FlowHandlerEvents, makeApiCallWithErrorHandler } from '@corbado/shared-ui';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { ButtonType, PasskeyScreensWrapperProps } from '../../components';
import { PasskeyScreensWrapper } from '../../components';
import useFlowHandler from '../../hooks/useFlowHandler';
import useUserData from '../../hooks/useUserData';

export const PasskeyBenefits = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'authenticationFlows.login.passkeyBenefits' });
  const { email, userName } = useUserData();
  const { appendPasskey } = useCorbado();
  const { navigateNext } = useFlowHandler();
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

  const handleCreatePasskey = useCallback(async () => {
    setLoading(true);

    await makeApiCallWithErrorHandler(
      appendPasskey,
      () => navigateNext(FlowHandlerEvents.PasskeySuccess),
      () => navigateNext(FlowHandlerEvents.PasskeyError),
    );
  }, [appendPasskey, email, navigateNext, userName]);

  const handleBack = useCallback(() => {
    return navigateNext(FlowHandlerEvents.MaybeLater);
  }, [navigateNext]);

  const handleClick = useCallback(
    async (btn: ButtonType) => {
      if (btn === 'primary') {
        return handleCreatePasskey();
      }

      return handleBack();
    },
    [handleBack, handleCreatePasskey],
  );

  const props: PasskeyScreensWrapperProps = useMemo(
    () => ({
      header,
      body,
      primaryButton,
      secondaryButton,
      loading,
      onClick: handleClick,
    }),
    [body, header, primaryButton, secondaryButton, loading, handleClick],
  );

  return (
    <>
      <PasskeyScreensWrapper {...props} />
    </>
  );
};
