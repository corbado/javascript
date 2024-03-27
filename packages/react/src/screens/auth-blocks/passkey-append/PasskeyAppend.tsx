import { type PasskeyAppendBlock } from '@corbado/shared-ui';
import { parsePhoneNumber } from 'libphonenumber-js';
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
  const [passkeyUserHandle, setPasskeyUserHandle] = useState(block.data.userHandle);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (block.data.userHandleType !== 'phone') {
      setPasskeyUserHandle(block.data.userHandle);
    } else {
      const parsedUserInfo = parsePhoneNumber(block.data.userHandle);
      setPasskeyUserHandle(parsedUserInfo ? parsedUserInfo.formatInternational() : block.data.userHandle);
    }

    setLoading(false);
  }, [block]);

  const headerText = useMemo(() => t(`header.${block.data.canBeSkipped ? 'append' : 'create'}`), [t]);
  const bodyPoint1Text = useMemo(() => t('body_point1'), [t]);
  const bodyPoint2Text = useMemo(() => t('body_point2'), [t]);
  const bodySubtext = useMemo(() => t('body_subtext'), [t]);
  const textDivider = useMemo(() => t('text_divider'), [t]);
  const primaryButtonText = useMemo(() => t(`button_start.${block.data.canBeSkipped ? 'append' : 'create'}`), [t]);
  const skipButtonText = useMemo(() => t('button_skip'), [t]);

  const fallbacksAvailable = block.data.availableFallbacks.length > 0;

  const appendPasskey = () => {
    setLoading(true);
    void block.passkeyAppend();
  };

  return (
    <div className='cb-pk-append'>
      <Text
        level='6'
        fontWeight='bold'
        className='cb-pk-append-header'
      >
        {headerText}
      </Text>
      <span className='cb-pk-append-icons-section'>
        <FingerPrintIcon className='cb-pk-append-icons-section-icon' />
        <FaceIdIcon className='cb-pk-append-icons-section-icon' />
      </span>
      <div className='cb-pk-append-user-info-section'>
        <Text
          textColorVariant='secondary'
          fontFamilyVariant='secondary'
        >
          {passkeyUserHandle ?? ''}
        </Text>
        {!block.data.canBeSkipped && (
          <EditIcon
            className='cb-pk-append-user-info-section-edit-icon'
            color='secondary'
            onClick={() => block.showEditUserData()}
          />
        )}
      </div>
      <div className='cb-pk-append-points-section'>
        <div className='cb-pk-append-points-section-point'>
          <SecureIcon className='cb-pk-append-points-section-point-icon' />
          <Text
            level='2'
            fontFamilyVariant='secondary'
          >
            {bodyPoint1Text}
          </Text>
        </div>
        <div className='cb-pk-append-points-section-point'>
          <DeviceIcon className='cb-pk-append-points-section-point-icon' />
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
      <div className='cb-pk-append-subtext'>
        <Text fontFamilyVariant='secondary'>{bodySubtext}</Text>
      </div>
      {fallbacksAvailable && (
        <>
          <Divider label={textDivider} />
          <div className='cb-pk-append-buttons-section'>
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
        <div className='cb-pk-append-skip-button-section'>
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
