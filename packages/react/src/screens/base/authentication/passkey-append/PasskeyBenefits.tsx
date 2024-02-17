import { type PasskeyAppendBlock } from '@corbado/shared-ui';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Body, Header, PrimaryButton } from '../../../../components';
import useFlowHandler from '../../../../hooks/useFlowHandler';

export const PasskeyBenefits = () => {
  const { block } = useFlowHandler();
  const { t } = useTranslation('translation', {
    keyPrefix: `authentication.${block?.type}.passkeyBenefits`,
  });
  const [primaryLoading, setPrimaryLoading] = useState<boolean>(false);
  const getTypedBlock = () => block as PasskeyAppendBlock;

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

  return (
    <div className='cb-layout-passkey'>
      <Header>{header}</Header>
      {body && <Body className='cb-body-spacing'>{body}</Body>}
      <PrimaryButton
        onClick={() => {
          setPrimaryLoading(true);
          return getTypedBlock().passkeyAppend();
        }}
        isLoading={primaryLoading}
      >
        {primaryButton}
      </PrimaryButton>
    </div>
  );
};
