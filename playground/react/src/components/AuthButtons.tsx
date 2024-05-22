import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsContext from '../contexts/SettingsContext';
export const AuthButtons = () => {
  const navigate = useNavigate();
  const { updateProjectId } = useContext(SettingsContext);
  const projectId = process.env.REACT_APP_CORBADO_PROJECT_ID_ManualTesting!;

  const navigateTo = (projectId: string, component: string) => {
    updateProjectId(projectId);
    navigate(`/${projectId}/${component}`);
  };

  return (
    <div className='auth-buttons'>
      <h2>You are not logged in. You can use the below auth pages to authenticate the user</h2>
      <button
        className='primary-auth-button'
        onClick={() => navigateTo(projectId, 'auth')}
      >
        Auth Page (with complete auth component)
      </button>
      <button
        className='primary-auth-button'
        onClick={() => navigateTo(projectId, 'signup')}
      >
        SignUp Page
      </button>
      <button
        className='primary-auth-button'
        onClick={() => navigateTo(projectId, 'login#login-init')}
      >
        Login Page
      </button>
    </div>
  );
};
