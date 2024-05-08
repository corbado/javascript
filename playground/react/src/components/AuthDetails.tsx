import { PasskeyList, useCorbado, User } from '@corbado/react';
import { useNavigate, useParams } from 'react-router-dom';

export const AuthDetails = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { logout } = useCorbado();

  return (
    <div className='component'>
      <div className='sub-container'>
        <User />
        <PasskeyList />
        <button
          onClick={async () => {
            await logout();

            navigate(`/${projectId}/auth#login-init`);
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
