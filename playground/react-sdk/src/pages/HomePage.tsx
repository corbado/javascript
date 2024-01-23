import { useCorbado } from '@corbado/react-sdk';
import FilledButton from '../components/buttons/FilledButton.tsx';
import { useNavigate } from 'react-router-dom';
import { withAuthRequired } from '../components/withAuthRequired.tsx';
import { UserDetails } from '../components/userDetails.tsx';

const HomePage = () => {
  const { isAuthenticated, logout } = useCorbado();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <div className='h-screen flex flex-col items-center justify-center'>You are not logged in.</div>;
  }

  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <div className='w-1/2'>
        <p className='font-bold text-2xl'>Welcome</p>
        <UserDetails />
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

const HomePageWithAuth = withAuthRequired(HomePage);

export default HomePageWithAuth;
