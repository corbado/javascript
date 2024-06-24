import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export type Props = {
  initialEmail: string;
};

export default function ConventionalLogin({ initialEmail }: Props) {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(initialEmail);
  const router = useRouter();

  return (
    <div
      id='conventional-login'
      className='flex flex-col space-y-2'
    >
      <div className='mb-2 font-bold text-xl'>Login</div>
      <input
        type='text'
        className='input-field  w-full'
        id='conventional-login-email'
        placeholder='Email'
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type='password'
        className='input-field w-full'
        id='conventional-login-password'
        placeholder='Password'
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <div>
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full'
          onClick={async () => {
            router.push('/post-login');
          }}
        >
          Login
        </button>
      </div>
      <div className='signup-area mt-4 flex flex-col items-center'>
        <Link
          href='/signup'
          className='underline'
        >
          Signup for an account
        </Link>
      </div>
    </div>
  );
}
