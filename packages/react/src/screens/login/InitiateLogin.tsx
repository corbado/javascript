import { useCorbado } from '@corbado/react-sdk';
import { canUsePasskeys, emailRegex, FlowHandlerEvents, FlowType } from '@corbado/shared-ui';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AuthFormScreenWrapper, FormInput, Header, SubHeader } from '../../components';
import useFlowHandler from '../../hooks/useFlowHandler';
import useUserData from '../../hooks/useUserData';

export const InitiateLogin = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'login.start' });
  const { setEmail } = useUserData();
  const { navigateNext, changeFlow } = useFlowHandler();
  const { loginWithPasskey } = useCorbado();
  const [formEmail, setFormEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    void initLoginWithAutoComplete();
  }, []);

  const initLoginWithAutoComplete = async () => {
    const hasPasskeySupport = await canUsePasskeys();
    if (!hasPasskeySupport) {
      return;
    }

    const response = await loginWithPasskey('', true);
    if (response.err) {
      return;
    }

    void navigateNext(FlowHandlerEvents.PasskeySuccess);
  };

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFormEmail(event.target.value);
  }, []);

  const login = async () => {
    try {
      const hasPasskeySupport = await canUsePasskeys();

      if (hasPasskeySupport) {
        const result = await loginWithPasskey(formEmail, false);

        if (result?.err) {
          throw result.val.name;
        }

        void navigateNext(FlowHandlerEvents.PasskeySuccess);
      }

      void navigateNext(FlowHandlerEvents.EmailOtp);
    } catch (e) {
      console.log(e);
      if (e === 'NoPasskeyAvailableError') {
        void navigateNext(FlowHandlerEvents.EmailOtp);
        return;
      }

      void navigateNext(FlowHandlerEvents.PasskeyError);
    }
  };

  const handleSubmit = useCallback(() => {
    if (!emailRegex.test(formEmail)) {
      setErrorMessage(t('validationError_email'));
      return;
    }

    setEmail(formEmail);
    void login();
  }, [formEmail, t, setEmail, navigateNext, setErrorMessage]);

  return (
    <>
      <Header>{t('header')}</Header>
      <SubHeader>
        {t('subheader')}
        <span
          className='cb-link-secondary'
          onClick={() => changeFlow(FlowType.SignUp)}
        >
          {t('button_signup')}
        </span>
      </SubHeader>
      <AuthFormScreenWrapper
        onSubmit={handleSubmit}
        submitButtonText={t('button_submit')}
        disableSubmitButton={!formEmail}
      >
        <FormInput
          name='username'
          label={t('textField_email')}
          onChange={onChange}
          value={formEmail}
          error={errorMessage}
          autoComplete='username webauthn'
        />
      </AuthFormScreenWrapper>
    </>
  );
};
