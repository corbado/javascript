import { FlowType } from '@corbado/web-core';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, LabelledInput, Text } from '../../components';
import useFlowHandler from '../../hooks/useFlowHandler';
import useUserData from '../../hooks/useUserData';
import { emailRegex } from '../../utils/validations';

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
  const { t } = useTranslation('translation', { keyPrefix: 'signup.start' });
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
      errors.name = t('validationError_name');
    }
    if (!signupData.username || !emailRegex.test(signupData.username)) {
      errors.username = t('validationError_email');
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
      <Text variant='header'>{t('header')}</Text>
      <Text variant='sub-header'>
        {t('subheader')}{' '}
        <span
          className='link text-secondary-font-color'
          onClick={() => changeFlow(FlowType.Login)}
        >
          {t('button_login')}
        </span>{' '}
      </Text>
      <div className='form-wrapper'>
        <form onSubmit={handleSubmit}>
          <div className='mb-2'>
            <LabelledInput
              name='name'
              label={t('textField_name')}
              onChange={onChange}
              value={signupData.name}
              error={errorData.name}
            />
            <LabelledInput
              name='username'
              label={t('textField_email')}
              onChange={onChange}
              value={signupData.username}
              error={errorData.username}
            />
          </div>
          <Button
            variant='primary'
            isLoading={loading}
          >
            {t('button_submit')}
          </Button>
        </form>
      </div>
    </>
  );
};
