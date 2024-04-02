import type { LoginIdentifiers, MissingFieldsBlock, TextFieldWithError } from '@corbado/shared-ui';
import type { FormEvent } from 'react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PrimaryButton } from '../../../components/ui2/buttons/PrimaryButton';
import InputField from '../../../components/ui2/input/InputField';
import { PhoneInputField } from '../../../components/ui2/input/PhoneInputField';
import { Header } from '../../../components/ui2/typography/Header';
import { SubHeader } from '../../../components/ui2/typography/SubHeader';

export const MissingFields = ({ block }: { block: MissingFieldsBlock }) => {
  const { t } = useTranslation('translation', { keyPrefix: `signup.missing-fields` });
  const [loading, setLoading] = useState<boolean>(false);

  const [username, setUsername] = useState<TextFieldWithError | null>(null);
  const usernameRef = useRef<HTMLInputElement>();

  const [phone, setPhone] = useState<TextFieldWithError | null>(null);
  const [phoneInput, setPhoneInput] = useState<string>('');

  useEffect(() => {
    setUsername(block.data.userName);
    setPhone(block.data.phone);

    setLoading(false);
  }, [block]);

  const headerText = useMemo(() => t('header'), [t]);
  const subheaderText = useMemo(() => t('subheader'), [t]);
  const buttonText = useMemo(() => t('button'), [t]);
  const phoneFieldLabel = useMemo(() => t('textField_phone'), [t]);
  const usernameFieldLabel = useMemo(() => t('textField_username'), [t]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setLoading(true);

      const identifiers: LoginIdentifiers = {
        phone: phoneInput,
        userName: usernameRef.current?.value,
      };

      void block.updateUserData(identifiers);
    },
    [block, phoneInput, setLoading],
  );

  const attacheRef = (el: HTMLInputElement | null) => {
    if (el && !usernameRef.current) {
      usernameRef.current = el;

      if (!usernameRef.current.value) {
        usernameRef.current.value = block.data.userName?.value || '';
      }
    }
  };

  return (
    <>
      <Header size='lg'>{headerText}</Header>
      <SubHeader>
        {subheaderText}
        {block.common.appName}
      </SubHeader>
      <form
        className='cb-form'
        onSubmit={handleSubmit}
      >
        {username && (
          <InputField
            label={usernameFieldLabel}
            id='username'
            name='username'
            autoComplete='username'
            errorMessage={username?.translatedError}
            ref={attacheRef}
          />
        )}
        {phone && (
          <PhoneInputField
            label={phoneFieldLabel}
            id='phone'
            errorMessage={phone?.translatedError}
            initialCountry='US'
            initialPhoneNumber={block.data.phone?.value}
            onChange={setPhoneInput}
          />
        )}

        <PrimaryButton
          type='submit'
          className='cb-signup-form-submit-button'
          isLoading={loading}
          onClick={handleSubmit}
        >
          {buttonText}
        </PrimaryButton>
      </form>
    </>
  );
};
