import { SignUp } from '@corbado/react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import withCorbadoProvider from '../hoc/withCorbadoProvider';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const onSignedUp = () => {
    navigate(`/${projectId}`);
  };

  const navigateToLogin = () => {
    navigate(`/login/${projectId}`);
  };

  return (
    <>
      <Header />
      <div className='component'>
        <SignUp
          onSignedUp={onSignedUp}
          navigateToLogin={navigateToLogin}
        />
      </div>
    </>
  );
};

export default withCorbadoProvider(SignUpPage);
