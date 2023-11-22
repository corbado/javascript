//import { useCorbado } from '@corbado/react-sdk';
//import type { LoginHandler } from '@corbado/web-core';
import { FlowHandlerEvents, FlowType } from '@corbado/web-core';
import React, { useEffect, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Button, LabelledInput, Link, Text } from '../components';
import useFlowHandler from '../hooks/useFlowHandler';
import useUserData from '../hooks/useUserData';

export const InitiateLogin = () => {
  const { t } = useTranslation();
  const { setEmail, email } = useUserData();
  //const [loginHandler, setLoginHandler] = useState<LoginHandler>();
  const { navigateNext, changeFlow } = useFlowHandler();
  //const { initAutocompletedLoginWithPasskey, loginWithPasskey } = useCorbado();
  const initialized = useRef(false);
  const conditionalUIStarted = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    //initAutocompletedLoginWithPasskey().then(lh => setLoginHandler(lh));
  }, []);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const onFocusEmail = () => {
    if (conditionalUIStarted.current) {
      return;
    }

    conditionalUIStarted.current = true;

    try {
      //await loginHandler?.completionCallback();
      void navigateNext(FlowHandlerEvents.PasskeySuccess);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> | MouseEvent) => {
    e.preventDefault();

    if (!email) {
      return;
    }

    try {
      //await loginWithPasskey(email);
      void navigateNext(FlowHandlerEvents.PasskeySuccess);
    } catch (e) {
      void navigateNext(FlowHandlerEvents.PasskeyError);
    }
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
        <span onClick={() => changeFlow(FlowType.SignUp)}>Create account</span>
      </Text>
      <div className='form-wrapper'>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <LabelledInput
              name='name'
              label={t('generic.name')}
              onChange={onChange}
              onFocus={onFocusEmail}
              value={email}
            />
          </div>
          <Button variant='primary'>{t('signup.continue_email')}</Button>
        </form>
      </div>
    </>
  );
};
