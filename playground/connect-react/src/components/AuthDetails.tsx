import { useNavigate, useParams } from 'react-router-dom';

export const AuthDetails = () => {
  const navigate = useNavigate();

  return (
    <div className='component'>
      <div className='sub-container'>
        <button
          onClick={async () => {
            navigate(`/login`);
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
