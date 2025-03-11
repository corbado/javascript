'use client';

import { useRouter } from 'next/navigation';
import { CorbadoConnectLogin } from '@corbado/connect-react';
import { useState } from 'react';
import ConventionalLogin from '@/app/login/ConventionalLogin';
import { postPasskeyLoginNew } from '@/app/login/actions';

export type Props = {
  clientState: string | undefined;
};

export default function LoginComponent({ clientState }: Props) {
  const router = useRouter();
  const [conventionalLoginVisible, setConventionalLoginVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [fallbackErrorMessage, setFallbackErrorMessage] = useState('');

  console.log('conventionalLoginVisible', conventionalLoginVisible);

  return (
    <div className='w-full flex justify-center'>
      <div className='w-96 my-4 mx-4'>
        <div className='login-area'>
          {conventionalLoginVisible ? (
            <ConventionalLogin
              initialEmail={email}
              initialError={fallbackErrorMessage}
            />
          ) : null}
          <div className='component'>
            <CorbadoConnectLogin
              onFallback={(identifier: string, message: string) => {
                setEmail(identifier);
                setConventionalLoginVisible(true);
                setFallbackErrorMessage(message);
                console.log('onFallback', identifier);
              }}
              onFallbackCustom={(identifier: string, code: string, _: string) => {
                setEmail(identifier);
                setConventionalLoginVisible(true);
                setFallbackErrorMessage(code);
                console.log('onFallbackCustom', identifier, code);
              }}
              onError={(error: string) => console.log('error', error)}
              onLoaded={(msg: string) => console.log('component has loaded: ' + msg)}
              onComplete={async (signedPasskeyData: string, clientState: string) => {
                await postPasskeyLoginNew(signedPasskeyData, clientState);
                router.push('/post-login');
              }}
              onSignupClick={() => router.push('/signup')}
              onHelpClick={() => alert('help requested')}
              clientState={clientState}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
