import { useNavigate } from 'react-router-dom';
import CorbadoAuthUI from '@corbado/react';

const AuthPage = () => {
  const navigate = useNavigate();

  const onLoggedIn = () => {
    navigate('/home');
  };

  return <CorbadoAuthUI onLoggedIn={onLoggedIn} />;
};

export default AuthPage;