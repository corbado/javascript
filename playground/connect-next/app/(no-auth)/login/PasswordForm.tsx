import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';

type Props = {
  initialUserProvidedIdentifier: string;
  initialError: string;
  onClick: (username: string, password: string) => Promise<string | undefined>;
};

export const PasswordForm = ({ onClick, initialUserProvidedIdentifier, initialError }: Props) => {
  const [username, setUsername] = useState(initialUserProvidedIdentifier);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(initialError);

  const handleLogin = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setMessage('Loading...');
    const maybeError = await onClick(username, password);
    if (maybeError) {
      setMessage(maybeError);
    }
  };

  return (
    <form className='flex flex-col space-y-4'>
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
          placeholder='user@acme.com'
          autoComplete='username'
          required
          className='mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm'
          value={username}
          onChange={e => setUsername(e.target.value)}
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
          autoComplete='current-password'
          required
          className='mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <div className='text-center'>{message}</div>
      <Button
        onClick={handleLogin}
        className='w-full'
        size='lg'
      >
        Login
      </Button>
    </form>
  );
};

export default PasswordForm;
