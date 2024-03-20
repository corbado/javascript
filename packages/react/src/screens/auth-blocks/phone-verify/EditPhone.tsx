import type { PhoneVerifyBlock } from '@corbado/shared-ui';
import type { FC } from 'react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PrimaryButton } from '../../../components/ui2/buttons/PrimaryButton';
import { SecondaryButton } from '../../../components/ui2/buttons/SecondaryButton';
import InputField from '../../../components/ui2/input/InputField';
import { Header } from '../../../components/ui2/typography/Header';

export interface EditPhoneProps {
  block: PhoneVerifyBlock;
}

export const EditPhone: FC<EditPhoneProps> = ({ block }) => {
  const { t } = useTranslation('translation', { keyPrefix: `${block.authType}.phone-verify.edit-phone` });
  const [phone, setPhone] = useState<string>(block.data.phone);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    phoneInputRef.current?.focus();
  }, []);

  const headerText = useMemo(() => t('header'), [t]);
  const primaryButtonText = useMemo(() => t('button_submit'), [t]);
  const secondaryButtonText = useMemo(() => t('button_cancel'), [t]);

  const handleConfirm = async () => {
    setLoading(true);

    const error = await block.updatePhone(phone);

    if (error) {
      setErrorMessage(error);
      setLoading(false);
      return;
    }
  };

  return (
    <div className='cb-edit-data-section'>
      <Header
        size='md'
        className='cb-edit-data-section-header'
      >
        {headerText}
      </Header>
      <InputField
        value={phone}
        errorMessage={errorMessage}
        ref={phoneInputRef}
        type='tel'
        inputMode='numeric'
        pattern='\+[0-9]*'
        onChange={e => setPhone(e.target.value)}
      />
      <PrimaryButton
        isLoading={loading}
        disabled={phone === block.data.phone}
        onClick={() => void handleConfirm()}
      >
        {primaryButtonText}
      </PrimaryButton>
      <SecondaryButton
        className='cb-edit-data-section-back-button'
        onClick={() => block.showPhoneOtpScreen()}
      >
        {secondaryButtonText}
      </SecondaryButton>
    </div>
  );
};
