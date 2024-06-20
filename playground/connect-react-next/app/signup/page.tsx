'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CorbadoConnectAppend } from '@corbado/connect-react';
import { createAccount, getAppendToken } from './actions';

enum SignupState {
  InProcess,
  PasskeyAppend,
}

export default function SignupPage() {
  const router = useRouter();
  const [signupState, setSignupState] = useState<SignupState>(SignupState.InProcess);
  const [email, setEmail] = useState('');

  switch (signupState) {
    case SignupState.InProcess:
      return (
        <>
          <div id='conventional-signup'>
            <p>Hey, your signup is currently in progress.</p>
            <p>
              <input
                type='text'
                className='input-field'
                id='conventional-signup-email'
                placeholder='Email'
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </p>
            <button
              onClick={async () => {
                await createAccount(email);
                setSignupState(SignupState.PasskeyAppend);
              }}
            >
              Click here to finish it.
            </button>
          </div>
          <div className='component'></div>
        </>
      );
    case SignupState.PasskeyAppend:
      return (
        <div className='component'>
          <CorbadoConnectAppend
            projectId='pro-2'
            onLoaded={(msg: string) => console.log('component has loaded: ' + msg)}
            onSkip={() => router.push('/home')}
            appendTokenProvider={async () => {
              const t = await getAppendToken();
              console.log(t);

              return t;
            }}
            onComplete={(method: string) => router.push('/home')}
            frontendApiUrlSuffix='frontendapi.corbado-dev.io'
          />
        </div>
      );
  }
}
