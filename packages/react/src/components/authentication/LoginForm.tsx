import type { LoginInitBlock, TextFieldWithError } from '@corbado/shared-ui';
import type { FC, FormEvent, MutableRefObject } from 'react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { InputFieldProps } from '../ui';
import { InputField, PhoneInputField, PrimaryButton } from '../ui';

export interface LoginFormProps {
  block: LoginInitBlock;
  loading: boolean;
  socialLoadingInProgress: boolean | undefined;
  textField: TextFieldWithError | null;
  inputRef: MutableRefObject<HTMLInputElement | undefined>;
  usePhone: boolean;
  setUsePhone: (usePhone: boolean) => void;
  setPhoneInput: (phone: string) => void;
  handleSubmit: (e: FormEvent) => void;
}

export const LoginForm: FC<LoginFormProps> = ({
  block,
  loading,
  socialLoadingInProgress,
  textField,
  inputRef,
  usePhone,
  setUsePhone,
  setPhoneInput,
  handleSubmit,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: `login.login-init.login-init` });

  const hasBothEmailAndUsername = block.data.emailEnabled && block.data.usernameEnabled;

  const submitButtonText = useMemo(() => t('button_submit'), [t]);
  const IdentifierInputField = useMemo(() => {
    const commonProps: Partial<InputFieldProps> & React.RefAttributes<HTMLInputElement> = {
      errorMessage: textField?.translatedError,
      ref: (el: HTMLInputElement | null) => el && (inputRef.current = el),
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
