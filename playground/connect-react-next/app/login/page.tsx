'use client';

import { useRouter } from 'next/navigation';
import { CorbadoConnectLogin } from '@corbado/connect-react';

export default function LoginPage() {
  const router = useRouter();

  return (
    <>
      <div
        id='conventional-login'
        style={{ display: 'none' }}
      >
        <div className='conventional-login'>
          <input
            type='text'
            className='input-field'
            id='conventional-login-email'
            placeholder='Username'
          />
          <input
            type='password'
            className='input-field'
            placeholder='Password'
          />
          <button
            type='button'
            onClick={() => router.push('/home')}
          >
            Login
          </button>
        </div>
      </div>
      <div className='component'>
        <CorbadoConnectLogin
          projectId='pro-2'
          fallbackUIContainerId='conventional-login'
          fallbackUITextFieldId='conventional-login-email'
          onLoaded={(msg: string) => console.log('component has loaded: ' + msg)}
          onComplete={(method: string) => router.push('/home')}
          frontendApiUrlSuffix='frontendapi.corbado-dev.io'
        />
      </div>
      <div>
        <p>Create an account.</p>
        <button onClick={() => router.push(`/signup`)}>Signup</button>
      </div>
    </>
  );
}
