'use client';

import { SignUp } from '@corbado/react';
import { useParams, useRouter } from 'next/navigation';
import Header from '../components/Header';

const SignUpPage = () => {
  const router = useRouter();
  const params = useParams<{ projectId: string }>();

  const onSignedUp = () => {
    router.push(`/${String(params?.projectId || 'pro-1')}`);
  };

  const navigateToLogin = () => {
    router.push(`/${String(params?.projectId || 'pro-1')}/login`);
  };

  return (
    <>
      <Header />
      <div className='component'>
        <SignUp
          onSignedUp={onSignedUp}
          navigateToLogin={navigateToLogin}
        />
      </div>
    </>
  );
};

export default SignUpPage;
