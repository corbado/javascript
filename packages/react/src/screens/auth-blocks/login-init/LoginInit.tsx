import type { LoginInitBlock, TextFieldWithError } from '@corbado/shared-ui';
import React, { type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FormInput, Header, PrimaryButton, SubHeader } from '../../../components';

export const LoginInit = ({ block }: { block: LoginInitBlock }) => {
  const { t } = useTranslation('translation', { keyPrefix: `login.login-init.login-init` });
  const [loading, setLoading] = useState<boolean>(false);

  const [emailOrUsername, setEmailOrUsername] = useState<TextFieldWithError | null>(null);
  const emailorUsernameRef = useRef<HTMLInputElement>();

  const [phone, setPhone] = useState<TextFieldWithError | null>(null);
  const phoneRef = useRef<HTMLInputElement>();

  useEffect(() => {
    setLoading(false);

    if (block.data.isPhoneFocused) {
      setPhone({ value: block.data.loginIdentifier, translatedError: block.data.loginIdentifierError });
    } else {
      setEmailOrUsername({ value: block.data.loginIdentifier, translatedError: block.data.loginIdentifierError });
    }
  }, [block]);

  const headerText = useMemo(() => t('header'), [t]);
  const subHeaderText = useMemo(() => t('subheader'), [t]);
  const switchAuthTypeButtonText = useMemo(() => t('button_signup'), [t]);
  const submitButtonText = useMemo(() => t('button_submit'), [t]);
  const emailOrUsernameFieldLabel = useMemo(() => t('textField_email'), [t]);
  const phoneFieldLabel = useMemo(() => t('textField_phone'), [t]);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);

      const isPhone = (phoneRef.current && phoneRef.current.value.length > 0) || false;
      const loginIdentifier = isPhone ? phoneRef.current?.value : emailorUsernameRef.current?.value;

      void block.start(loginIdentifier ?? '', isPhone);
    },
    [block],
  );

  return (
    <>
      <Header>{headerText}</Header>
      <Header>{block.common.appName}</Header>
      <SubHeader>
        {subHeaderText}
        <span
          className='cb-link-secondary'
          onClick={() => block.switchToSignup()}
        >
          {switchAuthTypeButtonText}
        </span>
      </SubHeader>
      <form
        className='cb-form'
        onSubmit={handleSubmit}
      >
        <div className='cb-form-body'>
          {block.data.emailOrUsernameEnabled && (
            <FormInput
              name='emailOrUsername'
              label={emailOrUsernameFieldLabel}
              error={emailOrUsername?.translatedError}
              ref={el => el && (emailorUsernameRef.current = el)}
            />
          )}
          {block.data.phoneEnabled && (
            <FormInput
              name='phone'
              type='phone'
              autoComplete='phone'
              label={phoneFieldLabel}
              error={phone?.translatedError}
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
