'use client';
export const runtime = 'edge';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAccount } from './actions';
import { generateRandomString } from '@/utils/random';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

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
                await createAccount(email, phone, password);
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
