import { PasskeyList, useCorbado } from '@corbado/react';
import { useNavigate } from 'react-router-dom';
import { UserDetails } from '../components/UserDetails';

const HomePage = () => {
  const { isAuthenticated, logout } = useCorbado();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className='unauthorized-component'>
        <h2>You are not logged in. You can use the below auth pages to authenticate the user</h2>
        <button
          style={{ width: '20%' }}
          onClick={() => navigate('/auth')}
        >
          Auth Page (with complete auth component)
        </button>
        <button
          style={{ width: '20%' }}
          onClick={() => navigate('/signup')}
        >
          SignUp Page
        </button>
        <button
          style={{ width: '20%' }}
          onClick={() => navigate('/login')}
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
            navigate('/auth');
          }}
        >
          Logout
        </button>
        <PasskeyList />
      </div>
    </div>
  );
};

export default HomePage;
