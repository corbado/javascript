import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { PasskeyScreensWrapperProps } from '../../components';
import { PasskeyScreensWrapper } from '../../components';
import useFlowHandler from '../../hooks/useFlowHandler';

export const PasskeyWelcome = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'authenticationFlows.signup.passkeySuccess' });
  const { navigateNext } = useFlowHandler();

  const header = useMemo(() => t('header'), [t]);
  const secondaryHeader = useMemo(() => t('subheader'), [t]);
  const body = useMemo(
    () => (
      <span>
        {t('body_text1')} <strong>{t('body_text2')}</strong> {t('body_text3')}
      </span>
    ),
    [t],
  );

  const primaryButton = useMemo(() => t('button'), [t]);

  const handleClick = useCallback(() => {
    void navigateNext();
  }, [navigateNext]);

  const props: PasskeyScreensWrapperProps = useMemo(
    () => ({
      header,
      secondaryHeader,
      body,
      primaryButton,
      onClick: handleClick,
    }),
    [header, secondaryHeader, body, primaryButton, handleClick],
  );

  return (
    <>
      <PasskeyScreensWrapper {...props} />
    </>
  );
};
