'use client';

import { Login } from '@corbado/react';
import { useParams, useRouter } from 'next/navigation';
import Header from '../components/Header';

const LoginPage = () => {
  const router = useRouter();
  const params = useParams<{ projectId: string }>();

  const onLoggedIn = () => {
    router.push(`/${String(params?.projectId || 'pro-1')}`);
  };

  const navigateToSignup = () => {
    router.push(`/${String(params?.projectId || 'pro-1')}/signup`);
  };

  return (
    <>
      <Header />
      <div className='component'>
        <Login
          onLoggedIn={onLoggedIn}
          navigateToSignUp={navigateToSignup}
        />
      </div>
    </>
  );
};

export default LoginPage;
