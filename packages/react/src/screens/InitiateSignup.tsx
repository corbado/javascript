import { FlowType } from '@corbado/web-core';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Button, LabelledInput, Link, Text } from '../components';
import useFlowHandler from '../hooks/useFlowHandler';
import useUserData from '../hooks/useUserData';
import { emailRegex } from '../utils/validations';

interface SignupForm {
  name: string;
  username: string;
}

export const InitiateSignup = () => {
  const { t } = useTranslation();

  const { navigateNext, changeFlow } = useFlowHandler();
  const { setEmail, setUserName } = useUserData();

  const formTemplate = { name: '', username: '' };

  const [signupData, setSignupData] = React.useState<SignupForm>({
    ...formTemplate,
  });
  const [errorData, setErrorData] = React.useState<SignupForm>({
    ...formTemplate,
  });
  const [loading, setLoading] = React.useState<boolean>(false);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    (event.target as HTMLInputElement).name;
    const { value, name } = event.target;
    setSignupData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSignup = (): void => {
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

    const errors: SignupForm = { ...formTemplate };

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

    setErrorData({ ...formTemplate });

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
          >
            text
          </Link>{' '}
          text
        </Trans>
        <span onClick={() => changeFlow(FlowType.Login)}>Log in</span>
      </Text>
      <div className='form-wrapper'>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
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
