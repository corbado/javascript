import { CorbadoConnectLogin } from '@corbado/connect-react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

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
            onClick={() => navigate('/home')}
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
          onComplete={(method: string) => navigate('/home')}
          frontendApiUrlSuffix='frontendapi.corbado-dev.io'
        />
      </div>
      <div>
        <p>Create an account.</p>
        <button onClick={() => navigate(`/signup`)}>Signup</button>
      </div>
    </>
  );
};

export default LoginPage;
