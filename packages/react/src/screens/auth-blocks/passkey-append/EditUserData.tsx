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

  const headerText = useMemo(() => t(`header.${block.data.userHandleType}`), [t]);
  const primaryButtonText = useMemo(() => t('button_submit'), [t]);
  const secondaryButtonText = useMemo(() => t('button_cancel'), [t]);
  const inputFieldComputedProps = useMemo(() => {
    let type: string, autoComplete: string, name: string;

    if (block.data.userHandleType === LoginIdentifierType.Phone) {
      type = 'tel';
      autoComplete = 'phone';
      name = 'phone';
    } else if (block.data.userHandleType === LoginIdentifierType.Email) {
      type = 'email';
      autoComplete = 'email';
      name = 'email';
    } else {
      type = 'username';
      autoComplete = 'username';
      name = 'username';
    }

    return {
      type,
      autoComplete,
      name,
    };
  }, [block.data.userHandleType, errorMessage, passkeyUserHandle]);

  const handleConfirm = async () => {
    setLoading(true);

    let error: string | undefined;

    switch (block.data.userHandleType) {
      case LoginIdentifierType.Email:
        error = await block.updateEmail(passkeyUserHandle);
        break;
      case LoginIdentifierType.Phone:
        error = await block.updatePhone(passkeyUserHandle);
        break;
      case LoginIdentifierType.Username:
        error = await block.updateUsername(passkeyUserHandle);
        break;
      default:
        throw new Error('Invalid user handle type');
    }

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
        {...inputFieldComputedProps}
        value={passkeyUserHandle}
        errorMessage={errorMessage}
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
