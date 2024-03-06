import { type PasskeyAppendBlock } from '@corbado/shared-ui';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { HorizontalRule, SubHeader } from '../../../components';
import { PrimaryButton } from '../../../components/ui2/buttons/PrimaryButton';
import { SecondaryButton } from '../../../components/ui2/buttons/SecondaryButton';
import { Divider } from '../../../components/ui2/Divider';
import { EditIcon } from '../../../components/ui2/icons/EditIcon';
import { EmailIcon } from '../../../components/ui2/icons/EmailIcon';
import { FaceIdIcon } from '../../../components/ui2/icons/FaceIdIcon';
import { FingerPrintIcon } from '../../../components/ui2/icons/FingerPrintIcon';
import { Header } from '../../../components/ui2/typography/Header';
import { Text } from '../../../components/ui2/typography/Text';
import { EditUserData } from './EditUserData';

export const PasskeyAppend = ({ block }: { block: PasskeyAppendBlock }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: `signup.passkey-append.passkey-append`,
  });
  const [passkeyUserHandle, setPasskeyUserHandle] = useState<string | undefined>(undefined);
  const [primaryLoading, setPrimaryLoading] = useState<boolean>(false);
  const [secondaryLoading, setSecondaryLoading] = useState<boolean>(false);
  const [editUserData, setEditUserData] = useState<boolean>(false);

  useEffect(() => {
    setPasskeyUserHandle(block.data.userHandle);

    setPrimaryLoading(false);
    setSecondaryLoading(false);
  }, [block]);

  const header = useMemo(
    () => (
      <span>
        {t('header')}
        <span
          className='cb-link-primary'
          onClick={() => void block.showPasskeyBenefits()}
        >
          {t('headerButton_showPasskeyBenefits')}
        </span>
      </span>
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
  const fallbacksAvailable = block.data.availableFallbacks.length > 0;

  if (editUserData) {
    return (
      <EditUserData
        block={block}
        back={() => setEditUserData(false)}
      />
    );
  }

  return (
    <div className='new-ui-component'>
      <div className='cb-container-2'>
        <div className='cb-pk-append-header-2'>
          <Text
            level='6'
            fontWeight='bold'
          >
            Enable Passkeys
          </Text>
          <span className='cb-pk-append-icons-section-2'>
            <FingerPrintIcon className='cb-pk-append-icons-section-icon-2' />
            <FaceIdIcon className='cb-pk-append-icons-section-icon-2' />
          </span>
          <Text
            level='4'
            fontWeight='bold'
          >
            Create an account with face, fingerprint or pin
          </Text>
          <span className='cb-pk-append-benefits-section-2'>
            <Text
              level='3'
              fontWeight='bold'
              fontFamilyVariant='secondary'
              className='cb-row-2'
            >
              This information will never leave your device.
            </Text>
            <SecondaryButton onClick={() => void block.showPasskeyBenefits()}>Learn more</SecondaryButton>
          </span>
          <Text
            level='3'
            fontWeight='bold'
            fontFamilyVariant='secondary'
            className='cb-row-2'
          >
            We’ll create an account for
          </Text>
        </div>
        <div className='cb-pk-append-email-section-2'>
          <div className='cb-pk-append-email-section-left-2'>
            <EmailIcon className='cb-pk-append-email-section-left-icon-2' />
          </div>
          <div className='cb-pk-append-email-section-middle-2'>
            <Text
              level='3'
              fontWeight='normal'
              fontFamilyVariant='secondary'
              textColorVariant='secondary'
            >
              {passkeyUserHandle}
            </Text>
          </div>
          <div
            className='cb-pk-append-email-section-right-2'
            onClick={() => setEditUserData(true)}
          >
            <EditIcon className='cb-pk-append-email-section-right-icon-2' />
          </div>
        </div>
        <PrimaryButton onClick={() => void block.passkeyAppend()}>Create account</PrimaryButton>
        {fallbacksAvailable && (
          <>
            <Divider label='Create account with' />
            <div className='cb-pk-append-buttons-section-2'>
              {block.data.availableFallbacks.map(fallback => (
                <SecondaryButton
                  key={fallback.label}
                  onClick={() => {
                    setSecondaryLoading(true);
                    void fallback.action();
                  }}
                  disabled={primaryLoading}
                >
                  {fallback.label}
                </SecondaryButton>
              ))}
            </div>
          </>
        )}
        {block.data.canBeSkipped && (
          <SecondaryButton
            onClick={() => void block.skipPasskeyAppend()}
            disabled={primaryLoading}
          >
            {t('button_skip')}
          </SecondaryButton>
        )}
      </div>
    </div>
  );

  return (
    <div className='cb-layout-passkey'>
      <Header>{header}</Header>
      <SubHeader className='cb-subheader-spacing'>{subHeader}</SubHeader>
      {/* <FingerprintIcon className={'cb-finger-print-icon'} /> */}
      <PrimaryButton
        onClick={() => {
          setPrimaryLoading(true);
          void block.passkeyAppend();
        }}
        isLoading={primaryLoading}
        disabled={secondaryLoading}
      >
        {primaryButton}
      </PrimaryButton>
      {fallbacksAvailable && <HorizontalRule>or</HorizontalRule>}
      {block.data.availableFallbacks.map(fallback => (
        <SecondaryButton
          key={fallback.label}
          onClick={() => {
            setSecondaryLoading(true);
            void fallback.action();
          }}
          // isLoading={secondaryLoading}
          // disabled={primaryLoading}
        >
          {fallback.label}
        </SecondaryButton>
      ))}
      {block.data.canBeSkipped && (
        <SecondaryButton
          onClick={() => void block.skipPasskeyAppend()}
          // isLoading={secondaryLoading}
          // disabled={primaryLoading}
        >
          {t('button_skip')}
        </SecondaryButton>
      )}
    </div>
  );
};
