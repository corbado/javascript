import type { LoginIdentifiers, SignUpField, SignupInitBlock } from '@corbado/shared-ui';
import type { FormEvent } from 'react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FormInput, Header, PrimaryButton, SubHeader } from '../../../../components';
import useFlowHandler from '../../../../hooks/useFlowHandler';

export const InitSignup = () => {
  const { block } = useFlowHandler();
  const { t } = useTranslation('translation', { keyPrefix: `authentication.signup.start` });
  const [email, setEmail] = useState<SignUpField | null>(null);
  const [fullName, setFullName] = useState<SignUpField | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const emailRef = useRef<HTMLInputElement>();
  const fullNameRef = useRef<HTMLInputElement>();
  const getTypedBlock = () => block as SignupInitBlock;

  useEffect(() => {
    setEmail(getTypedBlock().data.email);
    setFullName(getTypedBlock().data.fullName);

    setLoading(false);
  }, [block]);

  const headerText = useMemo(() => t('header'), [t]);
  const subHeaderText = useMemo(() => t('subheader'), [t]);
  const flowChangeButtonText = useMemo(() => t('button_login'), [t]);
  const submitButtonText = useMemo(() => t('button_submit'), [t]);
  const nameFieldLabel = useMemo(() => t('textField_name'), [t]);
  const emailFieldLabel = useMemo(() => t('textField_email'), [t]);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);

      const identifiers: LoginIdentifiers = {
        email: emailRef.current?.value,
      };
      const fullName = fullNameRef.current?.value;
      void getTypedBlock().updateUserData(identifiers, fullName);
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
          onClick={getTypedBlock().switchToLogin}
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
              label={nameFieldLabel}
              error={fullName?.translatedError}
              ref={el => el && (fullNameRef.current = el)}
            />
          )}
          <FormInput
            name='name'
            type='email'
            autoComplete='email'
            label={emailFieldLabel}
            error={email?.translatedError}
            ref={el => el && (emailRef.current = el)}
          />
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
