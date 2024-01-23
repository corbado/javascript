import { PasskeyList, useCorbado } from '@corbado/react';
import { useNavigate } from 'react-router-dom';
import { UserDetails } from '../components/UserDetails';

const HomePage = () => {
  const { isAuthenticated, logout } = useCorbado();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className='h-screen flex flex-col items-center justify-center'>
        <h2>You are not logged in. You can use the below auth pages to authenticate the user</h2>
        <button onClick={() => navigate('/auth')}>Auth Page (with complete auth component)</button>
        <button onClick={() => navigate('/signup')}>SignUp Page</button>
        <button onClick={() => navigate('/login')}>Login Page</button>
      </div>
    );
  }

  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <div className='w-1/2'>
        <p className='font-bold text-2xl'>Welcome</p>
        <UserDetails />
        <button
          onClick={async () => {
            await logout();

            // this should be covered by a guard (then we can remove it)
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
