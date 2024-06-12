import { CorbadoConnectLogin } from '@corbado/react';

const AuthPage = () => {
  return (
    <>
      <div id='conventional-login'>
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
            onClick={() => window.location.replace('/home')}
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
          onComplete={(method: string) => window.location.replace('/home')}
          frontendApiUrlSuffix='frontendapi.corbado-dev.io'
        />
      </div>
    </>
  );
};

export default AuthPage;
