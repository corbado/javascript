import { CorbadoAuth } from '@corbado/react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const AuthPage = () => {
  const navigate = useNavigate();

  const onLoggedIn = () => {
    navigate('/');
  };

  return (
    <>
      <Header />
      <div className='component'>
        <CorbadoAuth onLoggedIn={onLoggedIn} />
      </div>
    </>
  );
};

export default AuthPage;
