import { SignUp } from '@corbado/react';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const navigate = useNavigate();

  const onSignedUp = () => {
    navigate('/');
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  return (
    <SignUp
      onSignedUp={onSignedUp}
      navigateToLogin={navigateToLogin}
    />
  );
};

export default SignUpPage;
