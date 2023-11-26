import { useState } from 'react';
import FilledButton from '../components/buttons/FilledButton.tsx';
import RoundedTextInput from '../components/inputs/RoundedTextInput.tsx';
import useAuthUI from '../hooks/useAuthUI.ts';
import { AuthScreenNames } from '../contexts/AuthUIContext.ts';

const InitiateSignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const { switchScreen, setUserState } = useAuthUI();

  const submit = () => {
    setUserState({ email: email, username: username });
    switchScreen(AuthScreenNames.SelectSignUpMethod);
  };

  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <p className='font-bold text-2xl pb-2'>Create your account</p>
      <p className='font-bold text-lg pb-2'>
        You already have an account?{' '}
        <span
          className='cursor-pointer'
          onClick={() => switchScreen(AuthScreenNames.Login)}
        >
          Log in
        </span>
      </p>
      <div className='w-full'>
        <div className='grid gap-2'>
          <RoundedTextInput
            placeholder='Email'
            onChange={setEmail}
          />
          <RoundedTextInput
            placeholder='Username'
            onChange={setUsername}
          />
          <FilledButton
            content='Continue'
            onClick={submit}
          />
        </div>
      </div>
    </div>
  );
};

export default InitiateSignupPage;
