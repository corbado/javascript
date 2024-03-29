import { FlowHandlerEvents } from '@corbado/shared-ui';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { ButtonVariants, PasskeyScreensBaseProps } from '../../../../components';
import { PasskeyScreensBase } from '../../../../components';
import useFlowHandler from '../../../../hooks/useFlowHandler';

export const PasskeyAppend = () => {
  const { emitEvent, currentFlowType } = useFlowHandler();
  const { t } = useTranslation('translation', {
    keyPrefix: `authentication.${currentFlowType}.passkeyAppend`,
  });
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
    (btn: ButtonVariants) => {
      if (btn === 'primary') {
        setLoading(true);
        return emitEvent(FlowHandlerEvents.PrimaryButton);
      }

      return emitEvent(FlowHandlerEvents.SecondaryButton);
    },
    [emitEvent],
  );

  const props: PasskeyScreensBaseProps = useMemo(
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
      <PasskeyScreensBase {...props} />
    </>
  );
};
