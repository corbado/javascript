import { FlowHandlerEvents } from '@corbado/shared-ui';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { PasskeyScreensBaseProps } from '../../../../components';
import { PasskeyScreensBase } from '../../../../components';
import useFlowHandler from '../../../../hooks/useFlowHandler';

export const PasskeySuccess = () => {
  const { emitEvent, currentVerificationMethod } = useFlowHandler();
  const { t } = useTranslation('translation', {
    keyPrefix: `authentication.signup.passkeySuccess`,
  });

  const header = useMemo(() => t('header'), [t]);
  const secondaryHeader = useMemo(() => t('subheader'), [t]);
  const body = useMemo(
    () => (
      <span>
        {t('body_text1')} <strong>{t(`body_text2.${currentVerificationMethod}`)}</strong> {t('body_text3')}
      </span>
    ),
    [t],
  );

  const primaryButton = useMemo(() => t('button'), [t]);

  const handleClick = useCallback(() => {
    void emitEvent(FlowHandlerEvents.PrimaryButton);
  }, [emitEvent]);

  const props: PasskeyScreensBaseProps = useMemo(
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
      <PasskeyScreensBase {...props} />
    </>
  );
};
