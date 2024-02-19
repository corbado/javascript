import type { LoginIdentifiers, SignUpField, SignupInitBlock } from '@corbado/shared-ui';
import type { FormEvent } from 'react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FormInput, Header, PrimaryButton, SubHeader } from '../../../components';

export const InitSignup = ({ block }: { block: SignupInitBlock }) => {
  const { t } = useTranslation('translation', { keyPrefix: `authentication.signup-init.signup-init` });
  const [loading, setLoading] = useState<boolean>(false);

  const [username, setUsername] = useState<SignUpField | null>(null);
  const usernameRef = useRef<HTMLInputElement>();

  const [email, setEmail] = useState<SignUpField | null>(null);
  const emailRef = useRef<HTMLInputElement>();

  const [phone, setPhone] = useState<SignUpField | null>(null);
  const phoneRef = useRef<HTMLInputElement>();

  const [fullName, setFullName] = useState<SignUpField | null>(null);
  const fullNameRef = useRef<HTMLInputElement>();

  useEffect(() => {
    setUsername(block.data.userName);
    setEmail(block.data.email);
    setPhone(block.data.phone);
    setFullName(block.data.fullName);

    setLoading(false);
  }, [block]);

  const headerText = useMemo(() => t('header'), [t]);
  const subHeaderText = useMemo(() => t('subheader'), [t]);
  const flowChangeButtonText = useMemo(() => t('button_login'), [t]);
  const submitButtonText = useMemo(() => t('button_submit'), [t]);
  const fullNameFieldLabel = useMemo(() => t('textField_fullName'), [t]);
  const emailFieldLabel = useMemo(() => t('textField_email'), [t]);
  const phoneFieldLabel = useMemo(() => t('textField_phone'), [t]);
  const usernameFieldLabel = useMemo(() => t('textField_username'), [t]);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);

      const identifiers: LoginIdentifiers = {
        email: emailRef.current?.value,
        phone: phoneRef.current?.value,
        userName: usernameRef.current?.value,
      };

      const fullName = fullNameRef.current?.value;
      void block.updateUserData(identifiers, fullName);
    },
    [block],
  );

  return (
    <>
      <Header>{headerText}</Header>
      <SubHeader>
        {subHeaderText}
        <span
          className='cb-link-secondary'
          onClick={block.switchToLogin}
        >
          {flowChangeButtonText}
        </span>
      </SubHeader>
      <form
        className='cb-form'
        onSubmit={handleSubmit}
      >
        <div className='cb-form-body'>
          {fullName && (
            <FormInput
              name='fullName'
              label={fullNameFieldLabel}
              error={fullName?.translatedError}
              ref={el => el && (fullNameRef.current = el)}
            />
          )}
          {username && (
            <FormInput
              name='username'
              label={usernameFieldLabel}
              error={email?.translatedError}
              ref={el => el && (usernameRef.current = el)}
            />
          )}
          {email && (
            <FormInput
              name='email'
              type='email'
              autoComplete='email'
              label={emailFieldLabel}
              error={email?.translatedError}
              ref={el => el && (emailRef.current = el)}
            />
          )}
          {phone && (
            <FormInput
              name='phone'
              type='phone'
              autoComplete='phone'
              label={phoneFieldLabel}
              error={email?.translatedError}
              ref={el => el && (phoneRef.current = el)}
            />
          )}
        </div>
        <PrimaryButton
          disabled={loading}
          isLoading={loading}
        >
          {submitButtonText}
        </PrimaryButton>
      </form>
    </>
  );
};
