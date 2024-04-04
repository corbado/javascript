'use client';

import { CorbadoAuth } from '@corbado/react';
import { useRouter } from 'next/navigation';

export default function AuthForm() {
  const router = useRouter();

  const onLoggedIn = async () => {
    router.push('/dashboard');
  };

  return <CorbadoAuth onLoggedIn={onLoggedIn} />;
}
