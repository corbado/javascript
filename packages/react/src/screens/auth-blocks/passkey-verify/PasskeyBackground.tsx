import type { PasskeyVerifyBlock } from '@corbado/shared-ui';
import type { FC } from 'react';
import React, { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { FaceIdIcon } from '../../../components/ui2/icons/FaceIdIcon';
import { FingerPrintIcon } from '../../../components/ui2/icons/FingerPrintIcon';
import { LoadingSpinner } from '../../../components/ui2/LoadingSpinner';
import { Text } from '../../../components/ui2/typography/Text';

export interface PasskeyBackgroundProps {
  block: PasskeyVerifyBlock;
}

export const PasskeyBackground: FC<PasskeyBackgroundProps> = ({ block }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: `login.passkey-verify.passkey-background`,
  });
  const passkeyLoginStarted = useRef(false);

  useEffect(() => {
    if (passkeyLoginStarted.current) {
      return;
    }

    passkeyLoginStarted.current = true;
    void block.passkeyLogin();
  }, []);

  const headerText = useMemo(() => <span>{t('header')}</span>, [t]);
  const bodyTitleText = useMemo(() => t('body_title'), [t]);
  const bodyDescriptionText = useMemo(() => t('body_description'), [t]);

  return (
    <div className='cb-pk-verify-2'>
      <Text
        level='6'
        fontWeight='bold'
        className='cb-pk-verify-header-2'
      >
        {headerText}
      </Text>
      <span className='cb-pk-verify-icons-section-2'>
        <FingerPrintIcon className='cb-pk-verify-icons-section-icon-2' />
        <FaceIdIcon className='cb-pk-verify-icons-section-icon-2' />
      </span>
      <div className='cb-pk-verify-body-section-2'>
        <Text
          level='5'
          fontWeight='bold'
        >
          {bodyTitleText}
        </Text>
        <Text
          level='3'
          fontWeight='bold'
        >
          {bodyDescriptionText}
        </Text>
      </div>
      <LoadingSpinner className='cb-pk-verify-spinner-2' />
    </div>
  );
};
