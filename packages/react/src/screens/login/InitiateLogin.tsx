import { useCorbado } from '@corbado/react-sdk';
import type { LoginHandler } from '@corbado/web-core';
import { canUsePasskeys, FlowHandlerEvents, FlowType } from '@corbado/web-core';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AuthFormScreenWrapper, FormInput, Header, SubHeader } from '../../components';
import useFlowHandler from '../../hooks/useFlowHandler';
import useUserData from '../../hooks/useUserData';
import { emailRegex } from '../../utils/validations';

export const InitiateLogin = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'login.start' });
  const { setEmail } = useUserData();
  const { navigateNext, changeFlow } = useFlowHandler();
  const { initAutocompletedLoginWithPasskey, loginWithPasskey } = useCorbado();
  const [loginHandler, setLoginHandler] = useState<LoginHandler>();
  const [formEmail, setFormEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const initialized = useRef(false);
  const conditionalUIStarted = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    void initAutocompletedLoginWithPasskey().then(lh => {
        // for conditional UI we ignore errors and just skip that functionality to the user
        if (lh.err) {
            return;
        }

        setLoginHandler(lh.val);
    });
  }, []);

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFormEmail(event.target.value);
  }, []);

  const completeConditionalUI = async () => {
    if (conditionalUIStarted.current) {
      return;
    }

    conditionalUIStarted.current = true;

    try {
      await loginHandler?.completionCallback();
      void navigateNext(FlowHandlerEvents.PasskeySuccess);
    } catch (e) {
      //void navigateNext(FlowHandlerEvents.PasskeyError);
    }
  };

  const onFocusEmail = useCallback(() => {
    void completeConditionalUI();
  }, [loginHandler]);

  const login = async () => {
    try {
      const hasPasskeySupport = await canUsePasskeys();

      if (hasPasskeySupport) {
        await loginWithPasskey(formEmail);
        void navigateNext(FlowHandlerEvents.PasskeySuccess);
      }

      void navigateNext(FlowHandlerEvents.EmailOtp);
    } catch (e) {
      //TODO: if the error is that passkey is not found, then navigate to email otp
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
          onFocus={onFocusEmail}
          value={formEmail}
          error={errorMessage}
        />
      </AuthFormScreenWrapper>
    </>
  );
};
