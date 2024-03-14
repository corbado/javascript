import type { LoginInitBlock, TextFieldWithError } from '@corbado/shared-ui';
import React, { type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PrimaryButton } from '../../../components/ui2/buttons/PrimaryButton';
import { SecondaryButton } from '../../../components/ui2/buttons/SecondaryButton';
import InputField from '../../../components/ui2/input/InputField';
import { Header } from '../../../components/ui2/typography/Header';
import { SubHeader } from '../../../components/ui2/typography/SubHeader';
import { Text } from '../../../components/ui2/typography/Text';

export const LoginInit = ({ block }: { block: LoginInitBlock }) => {
  const { t } = useTranslation('translation', { keyPrefix: `login.login-init.login-init` });
  const [loading, setLoading] = useState<boolean>(false);
  const [textField, setTextField] = useState<TextFieldWithError | null>(null);
  const [usePhone, setUsePhone] = useState<boolean>(block.data.isPhoneFocused || !block.data.emailOrUsernameEnabled);
  const textFieldRef = useRef<HTMLInputElement>();

  useEffect(() => {
    setLoading(false);
    // TODO: set initial value of text field if available through block.data.loginIdentifier (this is important for aborted processes)
    if (block.data.isPhoneFocused || !block.data.emailOrUsernameEnabled) {
      setUsePhone(true);
    }

    setTextField({ value: block.data.loginIdentifier, translatedError: block.data.loginIdentifierError });

    void block.continueWithConditionalUI();
  }, [block]);

  const headerText = useMemo(() => t('header'), [t]);
  const subheaderText = useMemo(() => t('subheader'), [t]);
  const signUpText = useMemo(() => t('text_signup'), [t]);
  const flowChangeButtonText = useMemo(() => t('button_login'), [t]);
  const submitButtonText = useMemo(() => t('button_submit'), [t]);
  const emailFieldLabel = useMemo(() => t('textField.email'), [t]);
  const phoneFieldLabel = useMemo(() => t('textField.phone'), [t]);
  const emailFieldLink = useMemo(() => {
    if (block.data.phoneEnabled) {
      return {
        text: t('button_switchToAlternate.email'),
        onClick: () => setUsePhone(true),
      };
    }

    return undefined;
  }, [t]);
  const phoneFieldLink = useMemo(() => {
    if (block.data.emailOrUsernameEnabled) {
      return {
        text: t('button_switchToAlternate.phone'),
        onClick: () => setUsePhone(false),
      };
    }

    return undefined;
  }, [t]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setLoading(true);

      void block.start(textFieldRef.current?.value ?? '', usePhone);
    },
    [block],
  );

  const showEmailOrUsername = block.data.emailOrUsernameEnabled && !usePhone;
  const showPhone = block.data.phoneEnabled && usePhone;

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
        {showEmailOrUsername && (
          <InputField
            label={emailFieldLabel}
            id='email'
            name='email'
            type='email'
            autoComplete='email webauthn'
            errorMessage={textField?.translatedError}
            ref={el => el && (textFieldRef.current = el)}
            labelLink={emailFieldLink}
          />
        )}
        {showPhone && (
          <InputField
            label={phoneFieldLabel}
            id='phone'
            name='phone'
            autoComplete='phone webauthn'
            type='tel'
            inputMode='numeric'
            pattern='+[0-9]*'
            errorMessage={textField?.translatedError}
            ref={el => el && (textFieldRef.current = el)}
            labelLink={phoneFieldLink}
          />
        )}

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
