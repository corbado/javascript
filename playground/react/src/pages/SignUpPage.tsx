import { SignUp } from '@corbado/react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const SignUpPage = () => {
  const navigate = useNavigate();

  const onSignedUp = () => {
    navigate('/');
  };

  const navigateToLogin = () => {
    navigate('/login');
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

export default SignUpPage;
