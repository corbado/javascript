'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { generateTOTP, startMFASoftwareToken } from '@/app/mfa-software-token/actions';

export default function LoginPage() {
  const router = useRouter();
  const [conventionalLoginVisible, setConventionalLoginVisible] = useState(false);
  const [totp, setTotp] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async () => {
    setError('');
    const res = await startMFASoftwareToken(totp);

    if (!res.success) {
      setError(res.message ?? 'An unknown error occurred. Please try again later.');

      return;
    }

    if (res.screen === 'MFA_SOFTWARE_TOKEN') {
      router.push('/mfa-software-token');
    } else {
      router.push('/post-login');
    }
  };

  const onAutofillTOTP = async () => {
    setError('');
    const res = await generateTOTP();

    if (!res.success) {
      setError(res.message ?? 'An unknown error occurred. Please try again later.');

      return;
    }

    setTotp(res.otp ?? '');
  };

  return (
    <div className='w-full flex justify-center'>
      <div className='w-96 my-4 mx-4'>
        <div
          id='conventional-login'
          className='flex flex-col space-y-2'
        >
          <div className='mb-2 font-bold text-xl'>MFA</div>
          {error && <div className='w-full bg-red-200 border border-red-600 text-red-600 p-2'>{error}</div>}
          <input
            type='text'
            className='input-field  w-full'
            id='conventional-login-email'
            placeholder='TOTP'
            value={totp}
            onChange={e => setTotp(e.target.value)}
          />
          <div>
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full'
              onClick={onSubmit}
            >
              Submit
            </button>
          </div>
          <div>
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full'
              onClick={onAutofillTOTP}
            >
              Autofill TOTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
