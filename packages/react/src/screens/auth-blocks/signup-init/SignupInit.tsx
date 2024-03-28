import type { LoginIdentifiers, SignupInitBlock, TextFieldWithError } from '@corbado/shared-ui';
import type { FormEvent, MutableRefObject } from 'react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IconButton } from '../../../components/ui2/buttons/IconButton';
import { PrimaryButton } from '../../../components/ui2/buttons/PrimaryButton';
import { SecondaryButton } from '../../../components/ui2/buttons/SecondaryButton';
import { Divider } from '../../../components/ui2/Divider';
import InputField from '../../../components/ui2/input/InputField';
import { PhoneInputField } from '../../../components/ui2/input/PhoneInputField';
import { Header } from '../../../components/ui2/typography/Header';
import { SubHeader } from '../../../components/ui2/typography/SubHeader';
import { Text } from '../../../components/ui2/typography/Text';

export const SignupInit = ({ block }: { block: SignupInitBlock }) => {
  const { t } = useTranslation('translation', { keyPrefix: `signup.signup-init.signup-init` });
  const [loading, setLoading] = useState<boolean>(false);

  const [username, setUsername] = useState<TextFieldWithError | null>(null);
  const usernameRef = useRef<HTMLInputElement>();

  const [email, setEmail] = useState<TextFieldWithError | null>(null);
  const emailRef = useRef<HTMLInputElement>();

  const [phone, setPhone] = useState<TextFieldWithError | null>(null);
  const [phoneInput, setPhoneInput] = useState<string>('');

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
  const textDivider = useMemo(() => t('text_divider'), [t]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setLoading(true);

      const identifiers: LoginIdentifiers = {
        email: emailRef.current?.value,
        phone: phoneInput,
        userName: usernameRef.current?.value,
      };

      const fullName = fullNameRef.current?.value;
      void block.updateUserData(identifiers, fullName);
    },
    [block, phoneInput, setLoading],
  );

  const attacheRef = (
    ref: MutableRefObject<HTMLInputElement | undefined>,
    value: string | undefined,
    el: HTMLInputElement | null,
  ) => {
    if (el && !ref.current) {
      ref.current = el;

      if (!ref.current.value) {
        ref.current.value = value || '';
      }
    }
  };

  const socialLoginsAvailable = block.data.socialLogins.length > 0;
  const socialLoginButtonSize = block.data.socialLogins.length > 2 ? 'small' : 'large';

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
        {fullName && (
          <InputField
            id='name'
            name='name'
            label={fullNameFieldLabel}
            errorMessage={fullName?.translatedError}
            ref={attacheRef.bind(null, fullNameRef, block.data.fullName?.value)}
          />
        )}
        {username && (
          <InputField
            label={usernameFieldLabel}
            id='username'
            name='username'
            autoComplete='username'
            errorMessage={username?.translatedError}
            ref={attacheRef.bind(null, usernameRef, block.data.userName?.value)}
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
            ref={attacheRef.bind(null, emailRef, block.data.email?.value)}
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
          {submitButtonText}
        </PrimaryButton>
      </form>
      {socialLoginsAvailable && (
        <>
          <Divider
            label={textDivider}
            className='cb-social-login-divider'
          />
          <div className={`cb-social-login-buttons-section cb-social-login-buttons-section-${socialLoginButtonSize}`}>
            {block.data.socialLogins.map(social => (
              <IconButton
                key={social.name}
                className={`cb-social-login-buttton-${socialLoginButtonSize}`}
                icon={
                  <img
                    src={social.icon}
                    alt={social.name}
                  />
                }
                label={t(`social_signup.${social.name}`)}
                href={social.url}
                showIconOnly={socialLoginButtonSize === 'small'}
                labelProps={{
                  level: '2',
                  textColorVariant: 'primary',
                }}
                target='_blank'
              />
            ))}
          </div>
        </>
      )}
      <Text
        level='2'
        fontWeight='normal'
        className='cb-auth-change-section'
      >
        {loginText}
        <SecondaryButton
          colorVariant='link'
          disabled={loading}
          onClick={() => block.switchToLogin()}
        >
          {flowChangeButtonText}
        </SecondaryButton>
      </Text>
    </>
  );
};
