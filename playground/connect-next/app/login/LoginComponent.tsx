'use client';

import { useRouter } from 'next/navigation';
import { CorbadoConnectLogin } from '@corbado/connect-react';
import { useState } from 'react';
import ConventionalLogin from '@/app/login/ConventionalLogin';
import { postPasskeyLogin } from './actions';
import { confirmSignIn, signIn } from 'aws-amplify/auth';

export type Props = {
  clientState: string | undefined;
};

const decodeJwt = (token: string) => {
  const [, payload] = token.split('.');
  return JSON.parse(atob(payload));
};

type WithWebauthnId = {
  webauthnId: string;
};

export default function LoginComponent({ clientState }: Props) {
  const router = useRouter();
  const [conventionalLoginVisible, setConventionalLoginVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [fallbackErrorMessage, setFallbackErrorMessage] = useState('');

  const postPasskeyLoginNew = async (signedPasskeyData: string, clientState: string) => {
    // decode JWT
    const decoded = decodeJwt(signedPasskeyData) as WithWebauthnId;

    try {
      await signIn({
        username: decoded.webauthnId,
        options: { authFlowType: 'CUSTOM_WITHOUT_SRP' },
      });

      const resultConfirm = await confirmSignIn({
        challengeResponse: signedPasskeyData,
      });
      console.log('resultConfirm', resultConfirm);

      await postPasskeyLogin(clientState);

      router.push('/post-login');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className='w-full flex justify-center'>
      <div className='w-96 my-4 mx-4'>
        <div className='login-area'>
          {conventionalLoginVisible ? <ConventionalLogin initialUserProvidedIdentifier={email} /> : null}
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
              onComplete={async (signedPasskeyData: string, newClientState: string) => {
                await postPasskeyLoginNew(signedPasskeyData, newClientState);
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
