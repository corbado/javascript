'use client';

import { useRouter } from 'next/navigation';
import { CorbadoConnectLogin } from '@corbado/connect-react';
import Link from 'next/link';
import { useState } from 'react';
import ConventionalLogin from '@/app/login/ConventionalLogin';

export default function LoginPage() {
  const router = useRouter();
  const [conventionalLoginVisible, setConventionalLoginVisible] = useState(false);
  const [email, setEmail] = useState('');

  console.log('conventionalLoginVisible', conventionalLoginVisible);

  return (
    <div className='w-full flex justify-center'>
      <div className='w-96 my-4 mx-4'>
        <div className='login-area'>
          {conventionalLoginVisible ? <ConventionalLogin initialEmail={email} /> : null}
          <div className='component'>
            <CorbadoConnectLogin
              onFallback={(identifier: string) => {
                setEmail(identifier);
                setConventionalLoginVisible(true);
                console.log('onFallback', identifier);
              }}
              onError={error => console.log('error', error)}
              onLoaded={(msg: string) => console.log('component has loaded: ' + msg)}
              onComplete={_ => router.push('/home')}
              onSignupClick={() => router.push('/signup')}
              onHelpClick={() => alert('help requested')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
