'use client';

import { Login } from '@corbado/react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();

  const onLoggedIn = async () => {
    const shortSession = localStorage.getItem('cbo_short_session');
    const resp = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ shortSession }),
    });

    if (resp.ok) {
      router.push('/dashboard');
    } else {
      console.error('Failed to log in', resp);
    }
  };

  return <Login onLoggedIn={onLoggedIn} />;
}
