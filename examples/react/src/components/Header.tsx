import { useCorbado } from '@corbado/react';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { isAuthenticated, logout, loading } = useCorbado();
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
    <header className='bg-lightBrown text-white p-4 flex justify-between items-center'>
      <h1 className='text-2xl md:text-4xl'>Corbado React Test</h1>
      {loading ? null : isAuthenticated ? logoutButton : loginButton}
    </header>
  );
};
