'use client';

import { PasskeyList, useCorbado, User } from '@corbado/react';
import { useParams, useRouter } from 'next/navigation';

export const AuthDetails = () => {
  const router = useRouter();
  const params = useParams<{ projectId: string }>();
  const { logout } = useCorbado();

  return (
    <div className='component'>
      <div className='sub-container'>
        <User />
        <PasskeyList />
        <button
          onClick={async () => {
            await logout();
            router.push(`/${String(params?.projectId || 'pro-1')}/auth`);
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
