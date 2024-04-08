'use client';

import { SignUp } from '@corbado/react';
import { useRouter } from 'next/navigation';

export default function SignupForm() {
  const router = useRouter();

  const onSignedUp = async () => {
    router.push('/dashboard');
  };

  const navigateToLogin = () => {
    router.push('/login#login-init');
  };

  return (
    <SignUp
      onSignedUp={onSignedUp}
      navigateToLogin={navigateToLogin}
    />
  );
}
