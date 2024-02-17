import { type PasskeyAppendBlock } from '@corbado/shared-ui';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Header, PrimaryButton, SubHeader } from '../../../../components';
import useFlowHandler from '../../../../hooks/useFlowHandler';

export const PasskeyAppend = () => {
  const { block } = useFlowHandler();
  const { t } = useTranslation('translation', {
    keyPrefix: `authentication.signup.passkeyCreate`,
  });
  const [passkeyUserHandle, setPasskeyUserHandle] = useState<string | undefined>(undefined);
  const [primaryLoading, setPrimaryLoading] = useState<boolean>(false);
  const [secondaryLoading, setSecondaryLoading] = useState<boolean>(false);
  const getTypedBlock = () => block as PasskeyAppendBlock;

  useEffect(() => {
    setPasskeyUserHandle(getTypedBlock().data.userHandle);

    setPrimaryLoading(false);
    setSecondaryLoading(false);
  }, [block]);

  const header = useMemo(
    () => (
      <Header>
        <span>
          {t('header')}
          <span
            className='cb-link-primary'
            onClick={() => void getTypedBlock().showPasskeyBenefits()}
          >
            {t('headerButton_showPasskeyBenefits')}
          </span>
        </span>
      </Header>
    ),
    [t],
  );

  const subHeader = useMemo(
    () => (
      <span>
        {t('body')} <span className='cb-text-secondary'>{passkeyUserHandle}</span>.
      </span>
    ),
    [t, passkeyUserHandle],
  );

  const primaryButton = useMemo(() => t('button_start'), [t]);

  return (
    <div className='cb-layout-passkey'>
      <Header>{header}</Header>
      {subHeader && <SubHeader className='cb-subheader-spacing'>{subHeader}</SubHeader>}
      <PrimaryButton
        onClick={() => {
          setPrimaryLoading(true);
          return getTypedBlock().passkeyAppend();
        }}
        isLoading={primaryLoading}
        disabled={secondaryLoading}
      >
        {primaryButton}
      </PrimaryButton>
    </div>
  );
};
