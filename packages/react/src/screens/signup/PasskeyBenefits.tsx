import { useCorbado } from '@corbado/react-sdk';
import { FlowHandlerEvents } from '@corbado/shared-ui';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { ButtonType, PasskeyScreensWrapperProps } from '../../components';
import { PasskeyScreensWrapper } from '../../components';
import useFlowHandler from '../../hooks/useFlowHandler';
import useUserData from '../../hooks/useUserData';

export const PasskeyBenefits = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'signup.passkeyBenefits' });
  const { email, userName } = useUserData();
  const { signUpWithPasskey, shortSession, appendPasskey } = useCorbado();
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

    try {
      if (shortSession) {
        const resp = await appendPasskey();

        if (resp.err) {
          throw new Error(resp.val.name);
        }
      } else {
        if (!email || !userName) {
          setLoading(false);
          return;
        }

        const resp = await signUpWithPasskey(email, userName);

        if (resp.err) {
          throw new Error(resp.val.name);
        }
      }

      return navigateNext(FlowHandlerEvents.PasskeySuccess);
    } catch (e) {
      return navigateNext(FlowHandlerEvents.PasskeyError);
    }
  }, [appendPasskey, email, navigateNext, shortSession, signUpWithPasskey, userName]);

  const handleBack = useCallback(() => {
    return navigateNext(FlowHandlerEvents.MaybeLater, {
      isUserAuthenticated: !!shortSession,
    });
  }, [navigateNext, shortSession]);

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
