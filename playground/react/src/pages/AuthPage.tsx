import { CorbadoAuth } from '@corbado/react';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const navigate = useNavigate();

  const onLoggedIn = () => {
    navigate('/');
  };

  return (
    <CorbadoAuth
      onLoggedIn={onLoggedIn}
      isDevMode={true}
      customerSupportEmail='dev@test.com'
    />
  );
};

export default AuthPage;
