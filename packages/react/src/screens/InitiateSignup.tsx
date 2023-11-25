import { FlowType } from '@corbado/web-core';
import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Button, LabelledInput, Link, Text } from '../components';
import useFlowHandler from '../hooks/useFlowHandler';
import useUserData from '../hooks/useUserData';
import { emailRegex } from '../utils/validations';

interface SignupForm {
  name: string;
  username: string;
}

const defaultFormTemplate: SignupForm = {
  name: '',
  username: '',
};

const createFormTemplate = (email?: string, username?: string) => ({
  name: username || '',
  username: email || '',
});

export const InitiateSignup = () => {
  const { t } = useTranslation();
  const { navigateNext, changeFlow } = useFlowHandler();
  const { setEmail, email, setUserName, userName } = useUserData();

  const [signupData, setSignupData] = React.useState<SignupForm>({
    ...defaultFormTemplate,
  });
  const [errorData, setErrorData] = React.useState<SignupForm>({
    ...defaultFormTemplate,
  });
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    setSignupData(createFormTemplate(email, userName));
  }, []);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setSignupData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSignup = () => {
    setLoading(true);
    try {
      setEmail(signupData.username);
      setUserName(signupData.name);
      void navigateNext();
    } catch (error) {
      console.log({ error });
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> | MouseEvent) => {
    e.preventDefault();

    const errors: SignupForm = { ...defaultFormTemplate };

    if (!signupData.name) {
      errors.name = t('validation_errors.name');
    }
    if (!signupData.username || !emailRegex.test(signupData.username)) {
      errors.username = t('validation_errors.email');
    }

    setErrorData(errors);

    if (errors.name || errors.username) {
      return;
    }

    setErrorData({ ...defaultFormTemplate });

    void handleSignup();
  };

  return (
    <>
      <Text variant='header'>{t('signup.header')}</Text>
      <Text variant='sub-header'>
        {/* "text" is a placeholder value for translations */}
        <Trans i18nKey='signup.sub-header'>
          text{' '}
          <Link
            href=''
            className='text-secondary-font-color'
            onClick={() => changeFlow(FlowType.Login)}
          >
            text
          </Link>{' '}
          text
        </Trans>
        <span
          className='link text-secondary-font-color'
          onClick={() => changeFlow(FlowType.Login)}
        >
          Log in
        </span>{' '}
      </Text>
      <div className='form-wrapper'>
        <form onSubmit={handleSubmit}>
          <div className='mb-2'>
            <LabelledInput
              name='name'
              label={t('generic.name')}
              onChange={onChange}
              value={signupData.name}
              error={errorData.name}
            />
            <LabelledInput
              name='username'
              label={t('generic.email')}
              onChange={onChange}
              value={signupData.username}
              error={errorData.username}
            />
          </div>
          <Button
            variant='primary'
            isLoading={loading}
          >
            {t('signup.continue_email')}
          </Button>
        </form>
      </div>
    </>
  );
};
