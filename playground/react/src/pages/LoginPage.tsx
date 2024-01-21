import { Login } from '@corbado/react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const onLoggedIn = () => {
    navigate('/');
  };

  const navigateToSignup = () => {
    navigate('/signup');
  };

  return (
    <Login
      onLoggedIn={onLoggedIn}
      navigateToSignUp={navigateToSignup}
    />
  );
};

export default LoginPage;
