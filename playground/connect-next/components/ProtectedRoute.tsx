'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAuthSession } from 'aws-amplify/auth';

const isUserSignedIn = async (): Promise<boolean> => {
  try {
    const session = await fetchAuthSession();
    return session?.tokens?.idToken != null;
  } catch {
    return false;
  }
};

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    isUserSignedIn().then(isSignedIn => {
      if (!isSignedIn) {
        router.replace('/login');
      } else {
        setLoading(false);
      }
    });
  }, [router]);

  if (loading) return null; // or loading spinner

  return <>{children}</>;
};

export default ProtectedRoute;
