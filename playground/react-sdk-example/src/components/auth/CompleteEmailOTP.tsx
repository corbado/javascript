import RoundedTextInput from '../inputs/RoundedTextInput.tsx';
import FilledButton from '../buttons/FilledButton.tsx';
import { useState } from 'react';
import { InvalidUserInputError, useCorbado } from '@corbado/react-sdk';
import useAuthUI from '../../hooks/useAuthUI.ts';

const CompleteEmailOTP = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const { completeSignUpWithEmailOTP } = useCorbado();
  const { onAuthCompleted, userState } = useAuthUI();

  const submit = async () => {
    if (code.length !== 6) {
      setError('Please check your code again. It should contain 6 digits.');
      return;
    }

    const result = await completeSignUpWithEmailOTP(code);
    if (!result.err) {
      return onAuthCompleted();
    }

    switch (true) {
      case result.val instanceof InvalidUserInputError:
        setError(result.val.message);
        return;
      default:
        console.error(result.val);
    }
  };

  return (
    <div className='h-screen flex flex-col items-center justify-center text-center'>
      <div className='text-2xl bold mb-2'>Enter code to create account</div>
      <div>
        We just sent a one time code to {userState?.email}. <br /> The code expires shortly, so please enter it soon.
      </div>
      <div className='w-1/2 grid gap-2 mt-3'>
        <RoundedTextInput
          placeholder='Code (6 digits)'
          onChange={setCode}
        />
        {error !== undefined ? <p className='accent-red-700'>{error}</p> : <></>}
        <FilledButton
          content='Continue with email'
          onClick={submit}
        />
      </div>
    </div>
  );
};

export default CompleteEmailOTP;
