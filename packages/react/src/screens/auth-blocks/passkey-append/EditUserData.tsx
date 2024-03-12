import { LoginIdentifierType, type PasskeyAppendBlock } from '@corbado/shared-ui';
import type { FC } from 'react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PrimaryButton } from '../../../components/ui2/buttons/PrimaryButton';
import { SecondaryButton } from '../../../components/ui2/buttons/SecondaryButton';
import InputField from '../../../components/ui2/input/InputField';
import { Header } from '../../../components/ui2/typography/Header';

export interface EditUserDataProps {
  block: PasskeyAppendBlock;
}

export const EditUserData: FC<EditUserDataProps> = ({ block }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: `signup.passkey-append.edit-user-data`,
  });
  const [passkeyUserHandle, setPasskeyUserHandle] = useState<string>(block.data.userHandle);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const passkeyUserHandleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    passkeyUserHandleInputRef.current?.focus();
  }, []);

  const headerText = useMemo(
    () => (block.data.userHandleType === LoginIdentifierType.Phone ? t('header_phoneChange') : t('header_emailChange')),
    [t],
  );
  const primaryButtonText = useMemo(() => t('button_submit'), [t]);
  const secondaryButtonText = useMemo(() => t('button_cancel'), [t]);

  const handleConfirm = async () => {
    setLoading(true);

    const error =
      block.data.userHandleType === LoginIdentifierType.Phone
        ? await block.updatePhone(passkeyUserHandle)
        : await block.updateEmail(passkeyUserHandle);

    if (error) {
      setErrorMessage(error);
      setLoading(false);
      return;
    }
  };

  return (
    <div className='cb-edit-data-section-2'>
      <Header className='cb-edit-data-section-header-2'>{headerText}</Header>
      <InputField
        value={passkeyUserHandle}
        errorMessage={errorMessage}
        type={block.data.userHandleType === LoginIdentifierType.Phone ? 'tel' : 'email'}
        autoComplete={block.data.userHandleType === LoginIdentifierType.Phone ? 'phone' : 'email'}
        name={block.data.userHandleType === LoginIdentifierType.Phone ? 'phone' : 'email'}
        ref={passkeyUserHandleInputRef}
        onChange={e => setPasskeyUserHandle(e.target.value)}
      />
      <PrimaryButton
        isLoading={loading}
        disabled={passkeyUserHandle === block.data.userHandle}
        onClick={() => void handleConfirm()}
      >
        {primaryButtonText}
      </PrimaryButton>
      <SecondaryButton
        className='cb-edit-data-section-back-button-2'
        onClick={() => block.showPasskeyAppend()}
      >
        {secondaryButtonText}
      </SecondaryButton>
    </div>
  );
};
