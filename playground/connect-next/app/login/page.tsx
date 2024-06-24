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
              projectId={process.env.NEXT_PUBLIC_CORBADO_PROJECT_ID!}
              onFallback={(email: string) => {
                setEmail(email);
                setConventionalLoginVisible(true);
                console.log('onFallback', email);
              }}
              onLoaded={(msg: string) => console.log('component has loaded: ' + msg)}
              onComplete={(method: string) => router.push('/home')}
              frontendApiUrlSuffix={process.env.NEXT_PUBLIC_CORBADO_FRONTEND_API_URL_SUFFIX}
              onSignupClick={() => router.push('/signup')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
