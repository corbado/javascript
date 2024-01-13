import { FlowHandlerEvents } from '@corbado/shared-ui';
import type { RecoverableError } from '@corbado/web-core';
import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AuthFormScreenWrapper, FormInput, Header, SubHeader } from '../../components';
import useFlowHandler from '../../hooks/useFlowHandler';

interface SignupForm {
  name: string;
  fullName: string;
}

const defaultFormTemplate: SignupForm = {
  name: '',
  fullName: '',
};

const createFormTemplate = (email?: string, fullName?: string) => ({
  name: email || '',
  fullName: fullName || '',
});

export const Start = () => {
  const { currentUserState, emitEvent, currentFlowStyle } = useFlowHandler();
  const { t } = useTranslation('translation', { keyPrefix: `authenticationFlows.signup.${currentFlowStyle}.start` });

  const [signupData, setSignupData] = useState<SignupForm>({
    ...defaultFormTemplate,
  });
  const [emailError, setEmailError] = useState<RecoverableError | null>(null);
  const [userNameError, setUserNameError] = useState<RecoverableError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(false);
    setSignupData(createFormTemplate(currentUserState.email, currentUserState.fullName));
    setEmailError(null);
    setUserNameError(null);

    if (currentUserState.emailError) {
      setEmailError(currentUserState.emailError);
    }

    if (currentUserState.userNameError) {
      setUserNameError(currentUserState.userNameError);
    }
  }, [currentUserState]);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setSignupData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = () => {
    setLoading(true);
    void emitEvent(FlowHandlerEvents.PrimaryButton, {
      userStateUpdate: { email: signupData.name, fullName: signupData.fullName },
    });
  };

  return (
    <>
      <Header>{t('header')}</Header>
      <SubHeader>
        {t('subheader')}
        <span
          className='cb-link-secondary'
          onClick={() => void emitEvent(FlowHandlerEvents.ChangeFlow)}
        >
          {t('button_login')}
        </span>
      </SubHeader>
      <AuthFormScreenWrapper
        onSubmit={handleSubmit}
        submitButtonText={t('button_submit')}
        disableSubmitButton={loading}
        loading={loading}
      >
        <FormInput
          name='fullName'
          label={t('textField_name')}
          onChange={onChange}
          value={signupData.fullName}
          error={userNameError?.translatedMessage}
        />
        <FormInput
          name='name'
          type='email'
          autoComplete='email'
          label={t('textField_email')}
          onChange={onChange}
          value={signupData.name}
          error={emailError?.translatedMessage}
        />
      </AuthFormScreenWrapper>
    </>
  );
};
