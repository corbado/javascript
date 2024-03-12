import { type PasskeyAppendBlock } from '@corbado/shared-ui';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PrimaryButton } from '../../../components/ui2/buttons/PrimaryButton';
import { SecondaryButton } from '../../../components/ui2/buttons/SecondaryButton';
import { Divider } from '../../../components/ui2/Divider';
import { DeviceIcon } from '../../../components/ui2/icons/DeviceIcon';
import { EditIcon } from '../../../components/ui2/icons/EditIcon';
import { FaceIdIcon } from '../../../components/ui2/icons/FaceIdIcon';
import { FingerPrintIcon } from '../../../components/ui2/icons/FingerPrintIcon';
import { SecureIcon } from '../../../components/ui2/icons/SecureIcon';
import { Text } from '../../../components/ui2/typography/Text';

export const PasskeyAppend = ({ block }: { block: PasskeyAppendBlock }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: `signup.passkey-append.passkey-append`,
  });
  const [passkeyUserHandle, setPasskeyUserHandle] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setPasskeyUserHandle(block.data.userHandle);

    setLoading(false);
  }, [block]);

  const headerCreatePasskeyText = useMemo(() => t('header_createPasskey'), [t]);
  const headerAppendPasskeyText = useMemo(() => t('header_appendPasskey'), [t]);
  const bodyPoint1Text = useMemo(() => t('body_point1'), [t]);
  const bodyPoint2Text = useMemo(() => t('body_point2'), [t]);
  const bodySubtext = useMemo(() => t('body_subtext'), [t]);
  const textDivider = useMemo(() => t('text_divider'), [t]);
  const primaryButtonText = useMemo(() => t('button_start'), [t]);
  const skipButtonText = useMemo(() => t('button_skip'), [t]);

  const fallbacksAvailable = block.data.availableFallbacks.length > 0;

  const appendPasskey = () => {
    setLoading(true);
    void block.passkeyAppend();
  };

  return (
    <div className='cb-pk-append-2'>
      <Text
        level='6'
        fontWeight='bold'
        className='cb-pk-append-header-2'
      >
        {block.data.canBeSkipped ? headerAppendPasskeyText : headerCreatePasskeyText}
      </Text>
      <span className='cb-pk-append-icons-section-2'>
        <FingerPrintIcon className='cb-pk-append-icons-section-icon-2' />
        <FaceIdIcon className='cb-pk-append-icons-section-icon-2' />
      </span>
      <div className='cb-pk-append-user-info-section-2'>
        <Text
          textColorVariant='secondary'
          fontFamilyVariant='secondary'
        >
          {passkeyUserHandle ?? ''}
        </Text>
        {!block.data.canBeSkipped && (
          <EditIcon
            className='cb-pk-append-user-info-section-edit-icon-2'
            color='secondary'
            onClick={() => block.showEditUserData()}
          />
        )}
      </div>
      <div className='cb-pk-append-points-section-2'>
        <div className='cb-pk-append-points-section-point-2'>
          <SecureIcon className='cb-pk-append-points-section-point-icon-2' />
          <Text
            level='2'
            fontFamilyVariant='secondary'
          >
            {bodyPoint1Text}
          </Text>
        </div>
        <div className='cb-pk-append-points-section-point-2'>
          <DeviceIcon className='cb-pk-append-points-section-point-icon-2' />
          <Text
            level='2'
            fontFamilyVariant='secondary'
          >
            {bodyPoint2Text}
          </Text>
        </div>
      </div>
      <PrimaryButton
        isLoading={loading}
        onClick={appendPasskey}
      >
        {primaryButtonText}
      </PrimaryButton>
      <div className='cb-pk-append-subtext-2'>
        <Text fontFamilyVariant='secondary'>{bodySubtext}</Text>
      </div>
      {fallbacksAvailable && (
        <>
          <Divider label={textDivider} />
          <div className='cb-pk-append-buttons-section-2'>
            {block.data.availableFallbacks.map(fallback => (
              <SecondaryButton
                key={fallback.label}
                onClick={() => void fallback.action()}
                disabled={loading}
              >
                {t(fallback.label)}
              </SecondaryButton>
            ))}
          </div>
        </>
      )}
      {block.data.canBeSkipped && (
        <div className='cb-pk-append-skip-button-section-2'>
          <SecondaryButton
            onClick={() => void block.skipPasskeyAppend()}
            disabled={loading}
          >
            {skipButtonText}
          </SecondaryButton>
        </div>
      )}
    </div>
  );
};
