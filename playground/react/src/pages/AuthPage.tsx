import { CorbadoAuth } from '@corbado/react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import withCorbadoProvider from '../hoc/withCorbadoProvider';

const AuthPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const onLoggedIn = () => {
    navigate(`/${projectId}`);
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

export default withCorbadoProvider(AuthPage);
