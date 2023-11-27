import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { PasskeyScreensWrapper } from '../../components/PasskeyScreensWrapper';
import useFlowHandler from '../../hooks/useFlowHandler';

export const PasskeyWelcome = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'signup.passkeySuccess' });
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

  const props = useMemo(
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
