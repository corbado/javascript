import { Login } from '@corbado/react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';

const LoginPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const onLoggedIn = () => {
    navigate(`/${projectId}`);
  };

  const navigateToSignup = () => {
    navigate(`/${projectId}/signup`);
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
