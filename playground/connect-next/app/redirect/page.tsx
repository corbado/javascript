'use client';

import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { setIdToken } from './actions';
import { useEffect, useState } from 'react';

export default function Page() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const token = searchParams.get('token');
      const redirectUrl = searchParams.get('redirectUrl');
      if (!token || !redirectUrl) {
        return;
      }

      await setIdToken(token);
      setLoading(false);
      console.log('pushing redirectUrl', redirectUrl);
      router.push(redirectUrl);
    };

    init();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <div>Redirecting...</div>;
}
