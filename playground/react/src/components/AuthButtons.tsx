import { useNavigate, useParams } from 'react-router-dom';
export const AuthButtons = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  return (
    <div className='auth-buttons'>
      <h2>You are not logged in. You can use the below auth pages to authenticate the user</h2>
      <button
        className='primary-auth-button'
        onClick={() => navigate(`/${projectId}/auth`)}
      >
        Auth Page (with complete auth component)
      </button>
      <button
        className='primary-auth-button'
        onClick={() => navigate(`/${projectId}/signup`)}
      >
        SignUp Page
      </button>
      <button
        className='primary-auth-button'
        onClick={() => navigate(`/${projectId}/login#login-init`)}
      >
        Login Page
      </button>
    </div>
  );
};
