import { CorbadoConnectAppend, CorbadoConnectLogin } from '@corbado/connect-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

enum SignupState {
  InProcess,
  PasskeyAppend,
}

const SignupPage = () => {
  const navigate = useNavigate();
  const [signupState, setSignupState] = useState<SignupState>(SignupState.InProcess);

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
              />
            </p>
            <button onClick={() => setSignupState(SignupState.PasskeyAppend)}>Click here to finish it.</button>
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
            onSkip={() => navigate('/home')}
            appendTokenProvider={async () => {
              return 'token';
            }}
            onComplete={(method: string) => navigate('/home')}
            frontendApiUrlSuffix='frontendapi.corbado-dev.io'
          />
        </div>
      );
  }
};

export default SignupPage;
