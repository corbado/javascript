import { PasskeyList, useCorbado } from '@corbado/react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const HomePage = () => {
  const { shortSession, user, logout } = useCorbado();
  const navigate = useNavigate();

  if (!user || !shortSession) {
    return <div className='h-screen flex flex-col items-center justify-center'>You are not logged in.</div>;
  }

  const decodedShortSession = jwtDecode(shortSession);
  const serializedDecodedShortSession = JSON.stringify(decodedShortSession, null, 2);

  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <div className='w-1/2'>
        <p className='font-bold text-2xl'>Welcome</p>
        <p>Hi {user?.orig}, you are logged in.</p>
        <div className='mt-3 mb-3'>
          <p>This is your shortSession:</p>
          <pre className='break-words'>{serializedDecodedShortSession}</pre>
        </div>
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
