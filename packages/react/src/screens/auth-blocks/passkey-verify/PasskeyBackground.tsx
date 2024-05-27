import { getPlatformType, type PasskeyVerifyBlock } from '@corbado/shared-ui';
import type { FC } from 'react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LoadingSpinner, SecondaryButton, Text } from '../../../components';
import { FaceIdIcon } from '../../../components/ui/icons/FaceIdIcon';
import { FingerPrintIcon } from '../../../components/ui/icons/FingerPrintIcon';

export interface PasskeyBackgroundProps {
  block: PasskeyVerifyBlock;
}

export const PasskeyBackground: FC<PasskeyBackgroundProps> = ({ block }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: `login.passkey-verify.passkey-background`,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const passkeyLoginStarted = useRef(false);

  const platform = useMemo(() => getPlatformType(), []);
  const headerText = useMemo(() => <span>{t('header')}</span>, [t]);
  const bodyTitleText = useMemo(() => t('body_title'), [t]);
  const bodyDescriptionText = useMemo(() => t('body_description'), [t]);

  useEffect(() => {
    if (passkeyLoginStarted.current) {
      return;
    }

    passkeyLoginStarted.current = true;

    void block.passkeyLogin(true);
  }, []);

  return (
    <div className='cb-pk-verify'>
      <Text
        level='6'
        fontWeight='bold'
        className='cb-pk-verify-header'
        textColorVariant='header'
      >
        {headerText}
      </Text>
      <span className='cb-pk-verify-icons-section'>
        <FingerPrintIcon
          className='cb-pk-verify-icons-section-icon'
          platform={platform}
        />
        <FaceIdIcon
          className='cb-pk-verify-icons-section-icon'
          platform={platform}
        />
      </span>
      <div className='cb-pk-verify-body-section'>
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
      <LoadingSpinner className='cb-pk-verify-spinner' />
      <div className='cb-pk-verify-fallbacks'>
        {block.data.availableFallbacks.map(fallback => (
          <SecondaryButton
            key={fallback.label}
            disabled={loading}
            onClick={() => {
              setLoading(true);
              return void fallback.action();
            }}
          >
            {t(fallback.label)}
          </SecondaryButton>
        ))}
      </div>
    </div>
  );
};
