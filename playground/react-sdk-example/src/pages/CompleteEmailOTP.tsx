import RoundedTextInput from '../components/inputs/RoundedTextInput.tsx';
import FilledButton from '../components/buttons/FilledButton.tsx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCorbado } from '@corbado/react-sdk';

const CompleteEmailOTP = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { completeSignUpWithEmailOTP } = useCorbado();

  const submit = async () => {
    try {
      if (code.length !== 6) {
        setError('Please check your code again. It should contain 6 digits.');
        return;
      }

      await completeSignUpWithEmailOTP(code);
      navigate('/home');
    } catch (e) {
      setError('An unknown error has happened');
      console.log(e);
    }
  };

  return (
    <div className='h-screen flex flex-col items-center justify-center text-center'>
      <div className='text-2xl bold mb-2'>Enter code to create account</div>
      <div>
        We just sent a one time code to EMAIL. <br /> The code expires shortly, so please enter it soon.
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
        <p
          className='text-center cursor-pointer'
          onClick={() => navigate(-1)}
        >
          Cancel
        </p>
      </div>
    </div>
  );
};

export default CompleteEmailOTP;
