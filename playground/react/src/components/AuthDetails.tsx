import { PasskeyList, useCorbado } from '@corbado/react';
import { UserDetails } from './UserDetails';
import { useNavigate, useParams } from 'react-router-dom';

export const AuthDetails = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { logout } = useCorbado();

  return (
    <div className='component'>
      <div>
        <p>Welcome</p>
        <UserDetails />
        <button
          onClick={async () => {
            await logout();

            // TODO: this should be covered by a guard (then we can remove it)
            navigate(`/${projectId}/auth`);
          }}
        >
          Logout
        </button>
        <PasskeyList />
      </div>
    </div>
  );
};
