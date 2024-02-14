'use client';

import { Login } from '@corbado/react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();

  const onLoggedIn = async () => {
    router.push('/dashboard');
  };

  const navigateToSignUp = () => {
    router.push('/signup');
  };

  return (
    <Login
      onLoggedIn={onLoggedIn}
      navigateToSignUp={navigateToSignUp}
    />
  );
}
