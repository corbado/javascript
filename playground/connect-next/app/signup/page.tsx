'use client';

import { TOTP } from 'totp-generator';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateRandomString } from '@/lib/random';
import { signUp, signIn, setUpTOTP, verifyTOTPSetup, updateMFAPreference } from 'aws-amplify/auth';
import { setTOTPSecretCode } from '@/app/signup/actions';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const onClickSignUp = async (email: string, phone: string, password: string) => {
    const username = generateRandomString(10);

    try {
      const resSignUp = await signUp({
        username: username,
        password,
        options: {
          userAttributes: {
            email: email,
            phone_number: phone,
          },
        },
      });

      console.log(resSignUp);

      const resLogin = await signIn({ username, password });
      console.log(resLogin);

      const setupRes = await setUpTOTP();
      console.log('setupRes', setupRes);

      await setTOTPSecretCode(setupRes.sharedSecret);

      const { otp } = TOTP.generate(setupRes.sharedSecret);
      console.log('otp', otp);

      await verifyTOTPSetup({ code: otp });
      await updateMFAPreference({
        totp: 'PREFERRED',
      });

      router.push('/post-login');
    } catch (err) {
      console.error('Error during signup:', err);
    }
  };

  return (
    <div className='w-full flex justify-center'>
      <div className='w-96 my-4 mx-4'>
        <div className='mb-2 flex justify-between'>
          <div className='font-bold text-xl'>Signup</div>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 rounded'
            onClick={() => {
              const random = generateRandomString(6);
              const email = `integration-test+${random}@corbado.com`;
              setEmail(email);
              setPassword('asdfasdf');
              setPhone('+4915121609839');
            }}
          >
            auto
          </button>
        </div>
        <div className='signup-area flex flex-col space-y-2'>
          <input
            type='text'
            className='input-field  w-full'
            id='conventional-signup-email'
            placeholder='Email'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type='text'
            className='input-field  w-full'
            id='conventional-signup-phone'
            placeholder='Phone'
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
          <input
            type='password'
            className='input-field w-full'
            id='conventional-signup-email'
            placeholder='Password'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <div>
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full'
              onClick={async () => {
                await onClickSignUp(email, phone, password);
                router.push('/post-login');
              }}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
