import { useEffect, useRef, useState } from 'react';
import FilledButton from '../buttons/FilledButton.tsx';
import RoundedTextInput from '../inputs/RoundedTextInput.tsx';
import {
  InvalidPasskeyError,
  InvalidUserInputError,
  NoPasskeyAvailableError,
  UnknownUserError,
  useCorbado,
} from '@corbado/react-sdk';
import { LoginHandler, PasskeyChallengeCancelledError } from '@corbado/web-core';
import useAuthUI from '../../hooks/useAuthUI.ts';
import { AuthScreenNames } from '../../contexts/AuthUIContext.ts';

const Login = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [loginHandler, setLoginHandler] = useState<LoginHandler>();
  const { loginWithPasskey, initAutocompletedLoginWithPasskey, initLoginWithEmailOTP } = useCorbado();
  const { switchScreen, onAuthCompleted, setUserState } = useAuthUI();

  const initialized = useRef(false);
  const conditionalUIStarted = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    initAutocompletedLoginWithPasskey().then(lh => {
      // for conditional UI we ignore errors and just skip that functionality to the user
      if (lh.err) {
        return;
      }

      setLoginHandler(lh.val);
    });
  }, [initAutocompletedLoginWithPasskey]);

  const submit = async () => {
    const result = await loginWithPasskey(email);
    if (!result.err) {
      onAuthCompleted();
      return;
    }

    switch (true) {
      case result.val instanceof PasskeyChallengeCancelledError:
        // nothing to do here => the user can just try again
        return;
      case result.val instanceof InvalidUserInputError:
        setError('Check your email address and try again');
        return;
      case result.val instanceof UnknownUserError:
        setError('User does not exist, please check your email address');
        return;
      case result.val instanceof NoPasskeyAvailableError:
      case result.val instanceof InvalidPasskeyError:
        await fallbackToEmailOTP();
        return;
    }
  };

  const fallbackToEmailOTP = async () => {
    setUserState({ email: email, username: undefined });
    const result = await initLoginWithEmailOTP(email);
    if (!result.err) {
      switchScreen(AuthScreenNames.CompleteEmailOTP);
    }
  };

  const onFocusEmail = async () => {
    if (conditionalUIStarted.current) {
      return;
    }

    conditionalUIStarted.current = true;
    if (!loginHandler) {
      return;
    }

    const result = await loginHandler.completionCallback();
    if (!result.err) {
      return onAuthCompleted();
    }

    switch (true) {
      case result.val instanceof PasskeyChallengeCancelledError:
        // nothing to do here => the user can just try again
        return;
      case result.val instanceof InvalidPasskeyError:
        setError('We could not log you in using that passkey. Please try again by providing your email address.');
        return;
    }
  };

  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <p className='font-bold text-2xl pb-2'>Welcome back!</p>
      <p className='font-bold text-lg pb-2'>
        Don’t have an account yet?{' '}
        <span
          className='cursor-pointer'
          onClick={() => switchScreen(AuthScreenNames.InitiateSignUp)}
        >
          Create account
        </span>
      </p>
      <div className='w-full'>
        <div className='grid gap-2'>
          <RoundedTextInput
            placeholder='Email address'
            onChange={setEmail}
            onFocus={onFocusEmail}
          />
          {error ? <p className='text-lg text-red-600'>Error: {error}</p> : <></>}
          <FilledButton
            content='Continue with email'
            onClick={submit}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
