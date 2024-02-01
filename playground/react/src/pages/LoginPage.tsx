import { Login } from '@corbado/react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import withCorbadoProvider from '../hoc/withCorbadoProvider';

const LoginPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const onLoggedIn = () => {
    navigate(`/${projectId}`);
  };

  const navigateToSignup = () => {
    navigate(`/signup${projectId}`);
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

export default withCorbadoProvider(LoginPage);
