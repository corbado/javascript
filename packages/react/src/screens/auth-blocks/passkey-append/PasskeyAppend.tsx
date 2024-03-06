import { type PasskeyAppendBlock } from '@corbado/shared-ui';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PrimaryButton } from '../../../components/ui2/buttons/PrimaryButton';
import { SecondaryButton } from '../../../components/ui2/buttons/SecondaryButton';
import { Divider } from '../../../components/ui2/Divider';
import { EditIcon } from '../../../components/ui2/icons/EditIcon';
import { EmailIcon } from '../../../components/ui2/icons/EmailIcon';
import { FaceIdIcon } from '../../../components/ui2/icons/FaceIdIcon';
import { FingerPrintIcon } from '../../../components/ui2/icons/FingerPrintIcon';
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

  const headerText = useMemo(() => t('header'), [t]);
  const subHeaderText = useMemo(() => t('subheader'), [t]);
  const descriptionText = useMemo(() => t('body_description'), [t]);
  const userInfoTitleText = useMemo(() => t('body_userInfo'), [t]);
  const primaryButtonText = useMemo(() => t('button_start'), [t]);
  const skipButtonText = useMemo(() => t('button_skip'), [t]);

  const fallbacksAvailable = block.data.availableFallbacks.length > 0;

  const appendPasskey = () => {
    setLoading(true);
    void block.passkeyAppend();
  };

  return (
    <>
      <div className='cb-pk-append-header-2'>
        <Text
          level='6'
          fontWeight='bold'
        >
          {headerText}
        </Text>
        <span className='cb-pk-append-icons-section-2'>
          <FingerPrintIcon className='cb-pk-append-icons-section-icon-2' />
          <FaceIdIcon className='cb-pk-append-icons-section-icon-2' />
        </span>
        <Text
          level='4'
          fontWeight='bold'
        >
          {subHeaderText}
        </Text>
        <span className='cb-pk-append-benefits-section-2'>
          <Text
            level='2'
            fontWeight='bold'
            fontFamilyVariant='secondary'
            className='cb-row-2'
          >
            {descriptionText}
          </Text>
          <SecondaryButton onClick={() => void block.showPasskeyBenefits()}>Learn more</SecondaryButton>
        </span>
        {!block.data.canBeSkipped && (
          <Text
            level='2'
            fontWeight='bold'
            fontFamilyVariant='secondary'
            className='cb-row-2'
          >
            {userInfoTitleText}
          </Text>
        )}
      </div>
      <div className='cb-pk-append-email-section-2'>
        <div className='cb-pk-append-email-section-left-2'>
          <EmailIcon className='cb-pk-append-email-section-left-icon-2' />
        </div>
        <div className='cb-pk-append-email-section-middle-2'>
          <Text
            level='2'
            fontWeight='normal'
            fontFamilyVariant='secondary'
            textColorVariant='secondary'
          >
            {passkeyUserHandle}
          </Text>
        </div>
        {!block.data.canBeSkipped && (
          <div
            className='cb-pk-append-email-section-right-2'
            onClick={() => block.showEditUserData()}
          >
            <EditIcon className='cb-pk-append-email-section-right-icon-2' />
          </div>
        )}
      </div>
      <PrimaryButton
        isLoading={loading}
        onClick={appendPasskey}
      >
        {primaryButtonText}
      </PrimaryButton>
      {fallbacksAvailable && (
        <>
          <Divider label='Create account with' />
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
        <SecondaryButton
          onClick={() => void block.skipPasskeyAppend()}
          disabled={loading}
        >
          {skipButtonText}
        </SecondaryButton>
      )}
    </>
  );
};
