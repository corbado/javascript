import { useCorbado } from '@corbado/react-sdk';
import FilledButton from '../components/buttons/FilledButton.tsx';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const HomePage = () => {
  const { shortSession, user, logout } = useCorbado();
  const navigate = useNavigate();

  if (user === undefined || shortSession === undefined) {
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
        <FilledButton
          content='Logout'
          onClick={async () => {
            logout();
            navigate('/auth');
          }}
        />
      </div>
    </div>
  );
};

export default HomePage;
