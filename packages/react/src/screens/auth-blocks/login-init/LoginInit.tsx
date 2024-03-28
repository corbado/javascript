import type { LoginInitBlock, TextFieldWithError } from '@corbado/shared-ui';
import React, { type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IconButton } from '../../../components/ui2/buttons/IconButton';
import { PrimaryButton } from '../../../components/ui2/buttons/PrimaryButton';
import { SecondaryButton } from '../../../components/ui2/buttons/SecondaryButton';
import { Divider } from '../../../components/ui2/Divider';
import type { InputFieldProps } from '../../../components/ui2/input/InputField';
import InputField from '../../../components/ui2/input/InputField';
import { PhoneInputField } from '../../../components/ui2/input/PhoneInputField';
import { Header } from '../../../components/ui2/typography/Header';
import { SubHeader } from '../../../components/ui2/typography/SubHeader';
import { Text } from '../../../components/ui2/typography/Text';

export const LoginInit = ({ block }: { block: LoginInitBlock }) => {
  const { t } = useTranslation('translation', { keyPrefix: `login.login-init.login-init` });
  const [loading, setLoading] = useState<boolean>(false);
  const [textField, setTextField] = useState<TextFieldWithError | null>(null);
  const [usePhone, setUsePhone] = useState<boolean>(
    block.data.isPhoneFocused || !(block.data.emailEnabled || block.data.usernameEnabled),
  );
  const [phoneInput, setPhoneInput] = useState<string>('');
  const textFieldRef = useRef<HTMLInputElement>();
  const hasBothEmailAndUsername = block.data.emailEnabled && block.data.usernameEnabled;

  useEffect(() => {
    setLoading(false);
    const shouldUsePhone = block.data.isPhoneFocused || !(block.data.emailEnabled || block.data.usernameEnabled);
    if (shouldUsePhone) {
      setUsePhone(true);
    }

    setTextField({ value: block.data.loginIdentifier, translatedError: block.data.loginIdentifierError });

    if (textFieldRef.current) {
      textFieldRef.current.focus();
      textFieldRef.current.value = block.data.loginIdentifier ? block.data.loginIdentifier : '';
    }

    void block.continueWithConditionalUI();
  }, [block]);

  const headerText = useMemo(() => t('header'), [t]);
  const subheaderText = useMemo(() => t('subheader'), [t]);
  const signUpText = useMemo(() => t('text_signup'), [t]);
  const flowChangeButtonText = useMemo(() => t('button_signup'), [t]);
  const submitButtonText = useMemo(() => t('button_submit'), [t]);
  const textDivider = useMemo(() => t('text_divider'), [t]);
  const IdentifierInputField = useMemo(() => {
    const commonProps: Partial<InputFieldProps> & React.RefAttributes<HTMLInputElement> = {
      errorMessage: textField?.translatedError,
      ref: (el: HTMLInputElement | null) => el && (textFieldRef.current = el),
    };

    if (usePhone) {
      let fieldLinkText: string | undefined = undefined;

      if (hasBothEmailAndUsername) {
        fieldLinkText = t('button_switchToAlternate.emailOrUsername');
      } else if (block.data.emailEnabled) {
        fieldLinkText = t('button_switchToAlternate.email');
      } else if (block.data.usernameEnabled) {
        fieldLinkText = t('button_switchToAlternate.username');
      }

      const fieldLink = fieldLinkText
        ? {
            text: fieldLinkText,
            onClick: () => setUsePhone(false),
          }
        : undefined;

      return (
        <PhoneInputField
          label={t('textField.phone')}
          labelLink={fieldLink}
          autoComplete='tel webauthn'
          initialCountry='US'
          initialPhoneNumber={textField?.value}
          errorMessage={textField?.translatedError}
          onChange={setPhoneInput}
        />
      );
    }

    commonProps.labelLink = block.data.phoneEnabled
      ? {
          text: t('button_switchToAlternate.phone'),
          onClick: () => setUsePhone(true),
        }
      : undefined;

    if (hasBothEmailAndUsername || block.data.usernameEnabled) {
      return (
        <InputField
          label={hasBothEmailAndUsername ? t('textField.emailOrUsername') : t('textField.username')}
          id='username'
          name='username'
          type='username'
          autoComplete='username webauthn'
          {...commonProps}
        />
      );
    }

    return (
      <InputField
        label={t('textField.email')}
        id='email'
        name='email'
        type='email'
        autoComplete='email webauthn'
        {...commonProps}
      />
    );
  }, [block, t, textField, usePhone]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setLoading(true);

      if (usePhone) {
        void block.start(phoneInput, true);
      } else {
        void block.start(textFieldRef.current?.value ?? '', false);
      }
    },
    [block, usePhone, phoneInput],
  );

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
        {IdentifierInputField}
        <PrimaryButton
          type='submit'
          className='cb-signup-form-submit-button'
          isLoading={loading}
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
                target='_blank'
              />
            ))}
          </div>
        </>
      )}
      {block.isSignupEnabled() && (
        <Text
          level='2'
          fontWeight='normal'
          className='cb-auth-change-section'
        >
          {signUpText}
          <SecondaryButton
            colorVariant='link'
            disabled={loading}
            onClick={() => block.switchToSignup()}
          >
            {flowChangeButtonText}
          </SecondaryButton>
        </Text>
      )}
    </>
  );
};
