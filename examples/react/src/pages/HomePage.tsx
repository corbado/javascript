import { PasskeyList, useCorbado } from '@corbado/react';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { user, logout } = useCorbado();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    logout();
    navigate('/auth');
  }, [logout, navigate]);

  const logoutButton = useMemo(() => {
    return (
      <button
        className='bg-darkBrown text-white px-4 py-2 rounded hover:bg-black transition-colors'
        onClick={handleLogout}
      >
        Logout
      </button>
    );
  }, [handleLogout]);

  const loginButton = useMemo(() => {
    return (
      <button
        className='bg-darkBrown text-white px-4 py-2 rounded hover:bg-black transition-colors'
        onClick={() => navigate('/auth')}
      >
        Login
      </button>
    );
  }, [navigate]);

  return (
    <div className='font-eloquent text-black bg-white min-h-screen flex flex-col'>
      <header className='bg-lightBrown text-white p-4 flex justify-between items-center'>
        <h1 className='text-2xl md:text-4xl'>Corbado Test</h1>
        {user ? logoutButton : loginButton}
      </header>
      {user ? (
        <main className='flex-grow p-4'>
          <div className='font-eloquent text-black bg-white'>
            <h1 className='text-darkBrown'>Hi {user?.orig},</h1>
            <p className='text-lightBrown'>Welcome to Corbado React's test application</p>
          </div>
          <PasskeyList />
        </main>
      ) : null}
    </div>
  );
};

export default HomePage;
