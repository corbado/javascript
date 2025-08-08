'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { confirmSignIn, signIn } from 'aws-amplify/auth';
import ConventionalLogin from './ConventionalLogin';
import { CorbadoConnectLogin } from '@corbado/connect-react';
import Link from 'next/link';
import { postPasskeyLogin } from './actions';

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

const WrappedLogin = ({ clientState }: Props) => {
  const router = useRouter();

  const [conventionalLoginVisible, setConventionalLoginVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [fallbackErrorMessage, setFallbackErrorMessage] = useState('');

  console.log('fallbackErrorMessage', fallbackErrorMessage);

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

      await router.push('/post-login');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className='flex min-h-screen w-full items-center justify-center bg-gray-50'>
      <div className='z-10 w-full max-w-sm overflow-hidden rounded-2xl border border-gray-100 shadow-xl m-4'>
        {conventionalLoginVisible ? (
          <ConventionalLogin
            initialUserProvidedIdentifier={email}
            initialError={fallbackErrorMessage}
          />
        ) : null}
        {!conventionalLoginVisible ? (
          <>
            <div className='flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-8'>
              <h3 className='text-xl font-semibold'>Login with passkeys</h3>
              <p className='text-sm text-gray-500'>A simple and secure way to log in.</p>
            </div>
            <div className='login-area bg-gray-50 px-4 py-8 sm:px-8 justify-center'>
              <CorbadoConnectLogin
                onFallback={(identifier: string, message: string) => {
                  setEmail(identifier);
                  setConventionalLoginVisible(true);
                  setFallbackErrorMessage(message);
                }}
                onFallbackCustom={(identifier: string, code: string) => {
                  setEmail(identifier);
                  setConventionalLoginVisible(true);
                  setFallbackErrorMessage(code);
                }}
                onError={(error: string) => console.log('error', error)}
                onLoaded={(msg: string) => console.log('component has loaded: ' + msg)}
                onComplete={async (signedPasskeyData: string, newClientState: string) => {
                  await postPasskeyLoginNew(signedPasskeyData, newClientState);
                }}
                onSignupClick={() => router.push('/')}
                clientState={clientState}
              />
            </div>
          </>
        ) : null}
        <p className='text-center text-sm text-gray-600 mb-10'>
          {"Don't have an account? "}
          <Link
            href='/'
            className='font-semibold text-gray-800'
          >
            Sign up
          </Link>
          {' for free.'}
        </p>
      </div>
    </div>
  );
};

export default WrappedLogin;
