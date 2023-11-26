import FilledButton from '../components/buttons/FilledButton.tsx';
import { useLocation } from 'react-router-dom';
import { useCorbado } from '@corbado/react-sdk';
import { PasskeyChallengeCancelledError, UserAlreadyExistsError } from '@corbado/web-core';
import { useState } from 'react';
import { AuthScreenNames } from '../contexts/AuthUIContext.ts';
import useAuthUI from '../hooks/useAuthUI.ts';

const SelectSignupMethodPage = () => {
  const location = useLocation();
  const email = location.state.email;
  const username = location.state.username;
  const { signUpWithPasskey, initSignUpWithEmailOTP } = useCorbado();
  const { switchScreen, onAuthCompleted } = useAuthUI();
  const [error, setError] = useState<string | undefined>();

  const registerWithPasskey = async () => {
    const result = await signUpWithPasskey(email, username);
    console.log(result);
    if (!result.err) {
      onAuthCompleted();
      return;
    }

    switch (true) {
      case result.val instanceof UserAlreadyExistsError:
        setError('User already exists, please choose a different email address');
        return;
      case result.val instanceof PasskeyChallengeCancelledError:
        // nothing to do here => the user can just try again
        return;
      default:
        console.error('unknown error');
        break;
    }
  };

  const initEmailOTP = async () => {
    try {
      await initSignUpWithEmailOTP(email, username);
      switchScreen(AuthScreenNames.CompleteEmailOTP);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <p className='font-bold text-2xl pb-2'>Let's get you set up with Passkeys</p>
      <p className='font-bold text-lg'>We'll create an account for</p>
      <p>{email}</p>
      {error ? <p className='text-lg text-red-600'>Error: {error}</p> : <></>}
      <div className='w-1/2 mt-5'>
        <div className='grid gap-2'>
          <FilledButton
            content='Create your account'
            onClick={registerWithPasskey}
          />
          <FilledButton
            content='Send email one time code'
            onClick={initEmailOTP}
          />
          <p
            className='text-center cursor-pointer'
            onClick={() => switchScreen(AuthScreenNames.InitiateSignUp)}
          >
            Back
          </p>
        </div>
      </div>
    </div>
  );
};

export default SelectSignupMethodPage;
