import { CorbadoAuth, PasskeyList, useCorbado } from '@corbado/react';

export const CorbadoComponent = () => {
  const { isAuthenticated, logout } = useCorbado();

  return isAuthenticated ? (
    <div className='flex flex-col flex-grow'>
      <PasskeyList />
      <button
        className='bg-lightBrown hover:bg-darkBrown text-white font-bold py-2 px-4 rounded-full'
        onClick={logout}
      >
        Logout
      </button>
    </div>
  ) : (
    <CorbadoAuth onLoggedIn={() => void 0} />
  );
};
