import { PasskeyList, useCorbado } from '@corbado/react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserDetails } from '../components/UserDetails';
import withCorbadoProvider from '../hoc/withCorbadoProvider';

const HomePage = () => {
  const { isAuthenticated, logout } = useCorbado();
  const navigate = useNavigate();
  const { projectId } = useParams();

  if (!isAuthenticated) {
    return (
      <div className='unauthorized-component'>
        <h2>You are not logged in. You can use the below auth pages to authenticate the user</h2>
        <button
          style={{ width: '20%' }}
          onClick={() => navigate(`/auth/${projectId}`)}
        >
          Auth Page (with complete auth component)
        </button>
        <button
          style={{ width: '20%' }}
          onClick={() => navigate(`/signup/${projectId}`)}
        >
          SignUp Page
        </button>
        <button
          style={{ width: '20%' }}
          onClick={() => navigate(`/login/${projectId}`)}
        >
          Login Page
        </button>
      </div>
    );
  }

  return (
    <div className='component'>
      <div>
        <p>Welcome</p>
        <UserDetails />
        <button
          onClick={async () => {
            logout();

            // TODO: this should be covered by a guard (then we can remove it)
            navigate(`/auth/${projectId}`);
          }}
        >
          Logout
        </button>
        <PasskeyList />
      </div>
    </div>
  );
};

export default withCorbadoProvider(HomePage);
