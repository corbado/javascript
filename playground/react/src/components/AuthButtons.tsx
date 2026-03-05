'use client';

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import SettingsContext from '../contexts/SettingsContext';

export const AuthButtons = () => {
  const router = useRouter();
  const { updateProjectId } = useContext(SettingsContext);
  const projectId = process.env.NEXT_PUBLIC_CORBADO_PROJECT_ID || 'pro-1';

  const navigateTo = (projectId: string, component: string) => {
    updateProjectId(projectId);
    router.push(`/${projectId}/${component}`);
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
    </div>
  );
};
