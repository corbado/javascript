'use client';

import { CorbadoAuth } from '@corbado/react';
import { useParams, useRouter } from 'next/navigation';
import Header from '../components/Header';

const AuthPage = () => {
  const router = useRouter();
  const params = useParams<{ projectId: string }>();

  const onLoggedIn = () => {
    router.push(`/${String(params?.projectId || 'pro-1')}`);
  };

  return (
    <>
      <Header />
      <div className='component'>
        <CorbadoAuth onLoggedIn={onLoggedIn} />
      </div>
    </>
  );
};

export default AuthPage;
