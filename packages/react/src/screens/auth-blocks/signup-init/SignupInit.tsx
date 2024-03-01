import type { LoginIdentifiers, SignupInitBlock, TextFieldWithError } from '@corbado/shared-ui';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Disclaimer from '../../../components/ui2/Disclaimer';
import ErrorPopup from '../../../components/ui2/ErrorPopup';
import InputField from '../../../components/ui2/InputField';

export const SignupInit = ({ block }: { block: SignupInitBlock }) => {
  const falseFlag = true;
  const { t } = useTranslation('translation', { keyPrefix: `signup.signup-init.signup-init` });
  const [, setLoading] = useState<boolean>(false);

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
    <div className='new-ui-component'>
      <div className='cb-container-2'>
        {falseFlag && <ErrorPopup />}
        <header className='cb-header-2'>
          <p>{headerText}</p>
        </header>
        <p className='cb-subheader-2'>
          {subheaderText}
          {block.common.appName}
        </p>
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
        <button
          type='button'
          className='cb-button-2'
          onClick={handleSubmit}
        >
          {submitButtonText}
        </button>
        <p className='cb-auth-change-section-2'>
          {loginText}
          <span
            className='cb-link-2'
            onClick={() => block.switchToLogin()}
          >
            {flowChangeButtonText}
          </span>
        </p>
        <Disclaimer />
      </div>
    </div>
  );
};
