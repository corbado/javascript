import { CorbadoAuth } from '@corbado/react';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const navigate = useNavigate();

  const onLoggedIn = () => {
    navigate('/');
  };

  return <CorbadoAuth onLoggedIn={onLoggedIn} />;
};

export default AuthPage;
