import FilledButton from '../buttons/FilledButton.tsx';
import {
  InvalidUserInputError,
  useCorbado,
  PasskeyChallengeCancelledError,
  UserAlreadyExistsError,
} from '@corbado/react-sdk';
import { useState } from 'react';
import { AuthScreenNames } from '../../contexts/AuthUIContext.ts';
import useAuthUI from '../../hooks/useAuthUI.ts';

const SelectSignupMethod = () => {
  const { signUpWithPasskey, initSignUpWithEmailOTP } = useCorbado();
  const { switchScreen, onAuthCompleted, userState } = useAuthUI();
  const [error, setError] = useState<string | undefined>();

  const registerWithPasskey = async () => {
    if (!userState?.email) {
      setError('Please provide an email address');
      return;
    }

    const result = await signUpWithPasskey(userState?.email, userState?.username ?? '');
    if (!result.err) {
      onAuthCompleted();
      return;
    }

    switch (true) {
      case result.val instanceof PasskeyChallengeCancelledError:
        // nothing to do here => the user can just try again
        return;
      case result.val instanceof UserAlreadyExistsError:
      case result.val instanceof InvalidUserInputError:
        setError(result.val.message);
        return;
      default:
        console.error(result.val);
        break;
    }
  };

  const initEmailOTP = async () => {
    if (!userState?.email) {
      setError('Please provide an email address');
      return;
    }

    const result = await initSignUpWithEmailOTP(userState?.email, userState?.username ?? '');
    if (!result.err) {
      switchScreen(AuthScreenNames.CompleteEmailOTP);
      return;
    }

    switch (true) {
      case result.val instanceof InvalidUserInputError:
      case result.val instanceof UserAlreadyExistsError:
        setError(result.val.message);
        return;
      default:
        console.error(result.val);
        break;
    }
  };

  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <p className='font-bold text-2xl pb-2'>Let's get you set up with Passkeys</p>
      <p className='font-bold text-lg'>We'll create an account for</p>
      <p>{userState?.email}</p>
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

export default SelectSignupMethod;
