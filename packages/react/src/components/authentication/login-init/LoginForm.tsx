import type { LoginInitBlock, TextFieldWithError } from '@corbado/shared-ui';
import type { FC, FormEvent } from 'react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { InputFieldProps } from '../../ui';
import { InputField, PhoneInputField, PrimaryButton } from '../../ui';

export interface LoginFormProps {
  block: LoginInitBlock;
  socialLoadingInProgress: boolean | undefined;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const LoginForm: FC<LoginFormProps> = ({ block, loading, socialLoadingInProgress, setLoading }) => {
  const { t } = useTranslation('translation', { keyPrefix: `login.login-init.login-init` });

  const [textField, setTextField] = useState<TextFieldWithError | null>(null);
  const [usePhone, setUsePhone] = useState<boolean>(
    block.data.isPhoneFocused || !(block.data.emailEnabled || block.data.usernameEnabled),
  );
  const [phoneInput, setPhoneInput] = useState<string>('');
  const hasBothEmailAndUsername = block.data.emailEnabled && block.data.usernameEnabled;

  const textFieldRef = useRef<HTMLInputElement>();

  useEffect(() => {
    const shouldUsePhone = block.data.isPhoneFocused || !(block.data.emailEnabled || block.data.usernameEnabled);
    if (shouldUsePhone) {
      setUsePhone(true);
    }

    setTextField({ value: block.data.loginIdentifier, translatedError: block.data.loginIdentifierError });

    if (textFieldRef.current) {
      textFieldRef.current.focus();
      textFieldRef.current.value = block.data.loginIdentifier ? block.data.loginIdentifier : '';
    }
  }, [block]);

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
        <PhoneInputField
          label={t('textField.phone')}
          labelLink={fieldLink}
          id='phone'
          autoComplete='tel'
          initialCountry='US'
          initialPhoneNumber={textField?.value}
          errorMessage={textField?.translatedError}
          autoFocus={true}
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
          autoFocus={true}
          {...commonProps}
        />
      );
    }

    // we set autocomplete to username webauthn because Safari and Firefox need this for conditional UI to work
    return (
      <InputField
        label={t('textField.email')}
        id='email'
        name='email'
        type='email'
        autoComplete='username webauthn'
        autoFocus={true}
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

  return (
    <form
      className='cb-form'
      onSubmit={handleSubmit}
    >
      {IdentifierInputField}
      <PrimaryButton
        type='submit'
        className='cb-signup-form-submit-button'
        isLoading={loading}
        disabled={socialLoadingInProgress}
      >
        {submitButtonText}
      </PrimaryButton>
    </form>
  );
};
