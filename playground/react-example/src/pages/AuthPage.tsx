import { CorbadoAuth } from '@corbado/react';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const navigate = useNavigate();
  const isDevMode = process.env.NODE_ENV === 'development';

  const onLoggedIn = () => {
    navigate('/');
  };

  return (
    <CorbadoAuth
      onLoggedIn={onLoggedIn}
      isDevMode={isDevMode}
      customerSupportEmail='dev@test.com'
    />
  );
};

export default AuthPage;
