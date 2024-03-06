import type { LoginIdentifiers, SignupInitBlock, TextFieldWithError } from '@corbado/shared-ui';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PrimaryButton } from '../../../components/ui2/buttons/PrimaryButton';
import { SecondaryButton } from '../../../components/ui2/buttons/SecondaryButton';
import Disclaimer from '../../../components/ui2/Disclaimer';
import InputField from '../../../components/ui2/InputField';
import { Header } from '../../../components/ui2/typography/Header';
import { SubHeader } from '../../../components/ui2/typography/SubHeader';

export const SignupInit = ({ block }: { block: SignupInitBlock }) => {
  const { t } = useTranslation('translation', { keyPrefix: `signup.signup-init.signup-init` });
  const [loading, setLoading] = useState<boolean>(false);

  const [username, setUsername] = useState<TextFieldWithError | null>(null);
  const usernameRef = useRef<HTMLInputElement>();

  const [email, setEmail] = useState<TextFieldWithError | null>(null);
  const emailRef = useRef<HTMLInputElement>();

  const [phone, setPhone] = useState<TextFieldWithError | null>(null);
  const phoneRef = useRef<HTMLInputElement>();

  const [fullName, setFullName] = useState<TextFieldWithError | null>(null);
  const fullNameRef = useRef<HTMLInputElement>();

  useEffect(() => {
    setUsername(block.data.userName);
    setEmail(block.data.email);
    setPhone(block.data.phone);
    setFullName(block.data.fullName);

    setLoading(false);
  }, [block]);

  const headerText = useMemo(() => t('header'), [t]);
  const subheaderText = useMemo(() => t('subheader'), [t]);
  const loginText = useMemo(() => t('text_login'), [t]);
  const flowChangeButtonText = useMemo(() => t('button_login'), [t]);
  const submitButtonText = useMemo(() => t('button_submit'), [t]);
  const fullNameFieldLabel = useMemo(() => t('textField_fullName'), [t]);
  const emailFieldLabel = useMemo(() => t('textField_email'), [t]);
  const phoneFieldLabel = useMemo(() => t('textField_phone'), [t]);
  const usernameFieldLabel = useMemo(() => t('textField_username'), [t]);

  const handleSubmit = useCallback(() => {
    setLoading(true);

    const identifiers: LoginIdentifiers = {
      email: emailRef.current?.value,
      phone: phoneRef.current?.value,
      userName: usernameRef.current?.value,
    };

    const fullName = fullNameRef.current?.value;
    void block.updateUserData(identifiers, fullName);
  }, [block]);

  return (
    <>
      <Header>{headerText}</Header>
      <SubHeader>
        {subheaderText}
        {block.common.appName}
      </SubHeader>
      <form className='cb-form-2'>
        {fullName && (
          <InputField
            id='name'
            name='name'
            label={fullNameFieldLabel}
            errorMessage={fullName?.translatedError}
            ref={el => el && (fullNameRef.current = el)}
          />
        )}
        {username && (
          <InputField
            label={usernameFieldLabel}
            id='username'
            name='username'
            errorMessage={username?.translatedError}
            ref={el => el && (usernameRef.current = el)}
          />
        )}
        {email && (
          <InputField
            label={emailFieldLabel}
            id='email'
            name='email'
            type='email'
            autoComplete='email'
            errorMessage={email?.translatedError}
            ref={el => el && (emailRef.current = el)}
          />
        )}
        {phone && (
          <InputField
            label={phoneFieldLabel}
            id='phone'
            name='phone'
            autoComplete='phone'
            errorMessage={phone?.translatedError}
            ref={el => el && (phoneRef.current = el)}
          />
        )}
      </form>
      <PrimaryButton
        type='button'
        isLoading={loading}
        onClick={handleSubmit}
      >
        {submitButtonText}
      </PrimaryButton>
      <p className='cb-auth-change-section-2'>
        {loginText}
        <SecondaryButton onClick={() => block.switchToLogin()}>{flowChangeButtonText}</SecondaryButton>
      </p>
      <Disclaimer />
    </>
  );
};
