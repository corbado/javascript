'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { setIdToken } from './actions';
import { Suspense, useEffect, useState } from 'react';

export default function Page() {
  return (
    <Suspense>
      <Redirecting />
    </Suspense>
  );
}

function Redirecting() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const redirectUrl = searchParams.get('redirectUrl');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
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
