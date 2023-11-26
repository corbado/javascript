import { useCorbado } from '@corbado/react-sdk';
import type { LoginHandler } from '@corbado/web-core';
import { canUsePasskeys, FlowHandlerEvents, FlowType } from '@corbado/web-core';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, LabelledInput, Text } from '../components';
import useFlowHandler from '../hooks/useFlowHandler';
import useUserData from '../hooks/useUserData';
import { emailRegex } from '../utils/validations';

export const InitiateLogin = () => {
  const { t } = useTranslation();
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

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormEmail(event.target.value);
  };

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

  const onFocusEmail = () => {
    void completeConditionalUI();
  };

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> | MouseEvent) => {
    e.preventDefault();

    if (!emailRegex.test(formEmail)) {
      setErrorMessage(t('validation_errors.email'));
      return;
    }

    setEmail(formEmail);
    void login();
  };

  return (
    <>
      <Text variant='header'>Welcome back!</Text>
      <Text variant='sub-header'>
        Don't have an account yet?{' '}
        <span
          className='link text-secondary-font-color'
          onClick={() => changeFlow(FlowType.SignUp)}
        >
          Create account
        </span>{' '}
      </Text>
      <div className='form-wrapper'>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <LabelledInput
              name='name'
              label={t('generic.name')}
              onChange={onChange}
              onFocus={onFocusEmail}
              value={formEmail}
              error={errorMessage}
            />
          </div>
          <Button
            variant='primary'
            disabled={!formEmail}
          >
            {t('signup.continue_email')}
          </Button>
        </form>
      </div>
    </>
  );
};
