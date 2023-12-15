import { useCorbado } from '@corbado/react-sdk';
import {
  canUsePasskeys,
  emailRegex,
  FlowHandlerEvents,
  FlowType,
  makeApiCallWithErrorHandler,
} from '@corbado/shared-ui';
import type { RecoverableError } from '@corbado/web-core';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AuthFormScreenWrapper, FormInput, Header, SubHeader } from '../../components';
import useFlowHandler from '../../hooks/useFlowHandler';
import useUserData from '../../hooks/useUserData';

export const InitiateLogin = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'authenticationFlows.login.start' });
  const { t: tError } = useTranslation('translation', { keyPrefix: 'errors' });
  const { setEmail } = useUserData();
  const { navigateNext, changeFlow } = useFlowHandler();
  const { loginWithPasskey, loginWithConditionalUI, getUserAuthMethods } = useCorbado();
  const [formEmail, setFormEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
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

    const response = await loginWithConditionalUI();
    if (response.err) {
      return;
    }

    void navigateNext(FlowHandlerEvents.PasskeySuccess);
  };

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFormEmail(event.target.value);
  }, []);

  const login = async () => {
    setLoading(true);
    try {
      const hasPasskeySupport = await canUsePasskeys();

      if (hasPasskeySupport) {
        await makeApiCallWithErrorHandler(() => loginWithPasskey(formEmail));
        void navigateNext(FlowHandlerEvents.PasskeySuccess);
      }

      await makeApiCallWithErrorHandler(() => getUserAuthMethods(formEmail));
      void navigateNext(FlowHandlerEvents.EmailOtp);
    } catch (e) {
      const error = e as RecoverableError;

      switch (error.name) {
        case 'UnknownUserError':
          setErrorMessage(tError('serverError_unknownUser'));
          setLoading(false);
          break;
        case 'NoPasskeyAvailableError':
          void navigateNext(FlowHandlerEvents.EmailOtp);
          break;
        case 'UnknownError':
          throw e;
        default:
          void navigateNext(FlowHandlerEvents.PasskeyError);
          break;
      }
    }
  };

  const handleSubmit = useCallback(() => {
    if (!emailRegex.test(formEmail)) {
      setErrorMessage(tError('validationError_invalidEmail'));
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
        loading={loading}
      >
        <FormInput
          name='username'
          type='email'
          autoComplete='email webauthn'
          label={t('textField_email')}
          onChange={onChange}
          value={formEmail}
          error={errorMessage}
        />
      </AuthFormScreenWrapper>
    </>
  );
};
