import { Login } from '@corbado/react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const LoginPage = () => {
  const navigate = useNavigate();

  const onLoggedIn = () => {
    navigate('/');
  };

  const navigateToSignup = () => {
    navigate('/signup');
  };

  return (
    <>
      <Header />
      <div className='component'>
        <Login
          onLoggedIn={onLoggedIn}
          navigateToSignUp={navigateToSignup}
        />
      </div>
    </>
  );
};

export default LoginPage;
