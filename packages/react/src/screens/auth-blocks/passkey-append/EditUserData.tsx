import { LoginIdentifierType, type PasskeyAppendBlock } from '@corbado/shared-ui';
import type { FC, FormEvent } from 'react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import { SecondaryButton } from '../../../components/ui/buttons/SecondaryButton';
import InputField from '../../../components/ui/input/InputField';
import { PhoneInputField } from '../../../components/ui/input/PhoneInputField';
import { Header } from '../../../components/ui/typography/Header';

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

    if (block.data.userHandleType === LoginIdentifierType.Email) {
      type = 'email';
      autoComplete = 'email';
      name = 'email';
    } else if (block.data.userHandleType === LoginIdentifierType.Username) {
      type = 'username';
      autoComplete = 'username';
      name = 'username';
    } else {
      return undefined;
    }

    return {
      type,
      autoComplete,
      name,
    };
  }, [block.data.userHandleType, errorMessage, passkeyUserHandle]);

  const handleConfirm = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
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
    },
    [block, passkeyUserHandle],
  );

  return (
    <form
      className='cb-edit-data-section'
      onSubmit={e => void handleConfirm(e)}
    >
      <Header className='cb-edit-data-section-header'>{headerText}</Header>
      {block.data.userHandleType === LoginIdentifierType.Phone ? (
        <PhoneInputField
          initialPhoneNumber={passkeyUserHandle}
          errorMessage={errorMessage}
          onChange={setPasskeyUserHandle}
        />
      ) : (
        <InputField
          {...inputFieldComputedProps}
          value={passkeyUserHandle}
          errorMessage={errorMessage}
          ref={passkeyUserHandleInputRef}
          onChange={e => setPasskeyUserHandle(e.target.value)}
        />
      )}
      <PrimaryButton
        type='submit'
        isLoading={loading}
        onClick={e => {
          const noChange = passkeyUserHandle === block.data.userHandle;
          if (noChange) {
            block.showPasskeyAppend();
            return;
          }

          void handleConfirm(e);
        }}
      >
        {primaryButtonText}
      </PrimaryButton>
      <SecondaryButton
        className='cb-edit-data-section-back-button'
        onClick={() => block.showPasskeyAppend()}
      >
        {secondaryButtonText}
      </SecondaryButton>
    </form>
  );
};
