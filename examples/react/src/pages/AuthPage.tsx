import { CorbadoAuth } from '@corbado/react';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const navigate = useNavigate();

  const onLoggedIn = () => {
    navigate('/');
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-lightBrown'>
      <CorbadoAuth onLoggedIn={onLoggedIn} />
    </div>
  );
};

export default AuthPage;
