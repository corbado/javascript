'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateRandomString } from '@/lib/random';
import { signIn, signUp } from 'aws-amplify/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const username = generateRandomString(10);

    try {
      setMessage('Loading...');
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
      router.push('/post-login?post-signup=true');
    } catch (err) {
      console.error('Error during signup:', err);
    }
  };

  const handleAutofill = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const random = generateRandomString(6);
    const email = `integration-test+${random}@corbado.com`;
    setEmail(email);
    setPassword('asdfasdf');
    setPhone('+4915121609839');
  };

  return (
    <div className='flex min-h-screen w-full items-center justify-center bg-gray-50'>
      <div className='z-10 w-full max-w-sm overflow-hidden rounded-2xl border border-gray-100 shadow-xl m-4'>
        <div className='flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-8'>
          <h3 className='text-xl font-semibold'>Sign Up</h3>
          <p className='text-sm text-gray-500'>Create an account with your email, phone and password</p>
        </div>
        <form className='flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-8'>
          <div>
            <label
              htmlFor='email'
              className='block text-xs text-gray-600 uppercase'
            >
              Email Address
            </label>
            <input
              id='email'
              name='email'
              type='email'
              placeholder='Email'
              autoComplete='email'
              required
              className='mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor='password'
              className='block text-xs text-gray-600 uppercase'
            >
              Password
            </label>
            <input
              id='password'
              name='password'
              type='password'
              placeholder='Password'
              required
              className='mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor='phone'
              className='block text-xs text-gray-600 uppercase'
            >
              Phone Number
            </label>
            <input
              id='phone'
              name='phone'
              type='tel'
              placeholder='Phone'
              required
              autoComplete='tel'
              inputMode='tel'
              className='mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm'
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>
          {message && <div className='text-center text-red-700'>{message}</div>}
          <Button
            onClick={handleSignup}
            className='w-full'
            size='lg'
          >
            Sign Up
          </Button>
          <Button
            onClick={handleAutofill}
            className='w-full'
            size='lg'
          >
            Autofill
          </Button>
          <p className='text-center text-sm text-gray-600'>
            {'Already have an account? '}
            <Link
              href='/login'
              className='font-semibold text-gray-800'
            >
              Log in
            </Link>
            {' instead.'}
          </p>
        </form>
      </div>
    </div>
  );
}
