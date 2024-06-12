import { useNavigate, useParams } from 'react-router-dom';

export const AuthDetails = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  return (
    <div className='component'>
      <div className='sub-container'>
        <button
          onClick={async () => {
            navigate(`/auth`);
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
