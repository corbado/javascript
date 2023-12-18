import { FlowHandlerEvents } from '@corbado/shared-ui';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { ButtonType, PasskeyScreensWrapperProps } from '../../components';
import { PasskeyScreensWrapper } from '../../components';
import useFlowHandler from '../../hooks/useFlowHandler';

export const PasskeyAppend = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'authenticationFlows.login.passkeyPrompt' });
  const { emitEvent } = useFlowHandler();
  const [loading, setLoading] = useState<boolean>(false);

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

  const primaryButton = useMemo(() => t('button_start'), [t]);
  const secondaryButton = useMemo(() => t('button_skip'), [t]);

  const handleClick = useCallback(
    (btn: ButtonType) => {
      if (btn === 'primary') {
        setLoading(true);
        return emitEvent(FlowHandlerEvents.PrimaryButton);
      }

      return emitEvent(FlowHandlerEvents.SecondaryButton);
    },
    [emitEvent],
  );

  const props: PasskeyScreensWrapperProps = useMemo(
    () => ({
      header,
      primaryButton,
      secondaryButton,
      primaryLoading: loading,
      onClick: handleClick,
    }),
    [header, primaryButton, secondaryButton, loading, handleClick],
  );

  return (
    <>
      <PasskeyScreensWrapper {...props} />
    </>
  );
};
