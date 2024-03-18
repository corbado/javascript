import type { LoginInitBlock, TextFieldWithError } from '@corbado/shared-ui';
import React, { type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PrimaryButton } from '../../../components/ui2/buttons/PrimaryButton';
import { SecondaryButton } from '../../../components/ui2/buttons/SecondaryButton';
import type { InputFieldProps } from '../../../components/ui2/input/InputField';
import InputField from '../../../components/ui2/input/InputField';
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
  const textFieldRef = useRef<HTMLInputElement>();
  const hasBothEmailAndUsername = block.data.emailEnabled && block.data.usernameEnabled;

  useEffect(() => {
    setLoading(false);
    if (block.data.isPhoneFocused || !(block.data.emailEnabled || block.data.usernameEnabled)) {
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
        <InputField
          label={t('textField.phone')}
          id='phone'
          name='phone'
          autoComplete='phone webauthn'
          type='tel'
          inputMode='numeric'
          pattern='+[0-9]*'
          labelLink={fieldLink}
          {...commonProps}
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

      void block.start(textFieldRef.current?.value ?? '', usePhone);
    },
    [block, usePhone],
  );

  return (
    <>
      <Header size='lg'>{headerText}</Header>
      <SubHeader>
        {subheaderText}
        {block.common.appName}
      </SubHeader>
      <form
        className='cb-form-2'
        onSubmit={handleSubmit}
      >
        {IdentifierInputField}
        <PrimaryButton
          type='submit'
          className='cb-signup-form-submit-button-2'
          isLoading={loading}
        >
          {submitButtonText}
        </PrimaryButton>
      </form>
      <Text
        level='2'
        fontWeight='normal'
        className='cb-auth-change-section-2'
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
    </>
  );
};