'use client';
import { postPasskeyAppend } from '@/app/post-login/actions';
import { CorbadoConnectAppend } from '@corbado/connect-react';
import { useSearchParams } from 'next/navigation';
import { getAppendToken } from '../actions';
import { useEffect, useState } from 'react';

export const runtime = 'edge';

export default function PostLoginPage() {
  const searchParams = useSearchParams();
  const identifier = searchParams.get('identifier');
  const email = searchParams.get('email');
  const redirectUrl = searchParams.get('redirectUrl');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (identifier) {
      document.cookie = `identifier=${identifier}; path=/;`;
      document.cookie = `displayName=${email}; path=/;`;
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='w-full flex justify-center'>
      <div className='w-96 my-4 mx-4'>
        <div className='mb-2 flex justify-between'>
          <CorbadoConnectAppend
            onSkip={async status => {
              //const redirectUrl = `auth://callback?status=${status}`;
              if (!redirectUrl) {
                console.error('No redirect URL provided');
                return;
              }
              console.log('Redirecting to:', redirectUrl);
              window.location.href = redirectUrl;
            }}
            appendTokenProvider={async () => {
              const t = await getAppendToken();
              console.log(t);

              return t;
            }}
            onComplete={async (status, clientSideState: string) => {
              await postPasskeyAppend('', clientSideState);
              // const redirectUrl = `auth://callback?status=${status}`;
              if (!redirectUrl) {
                console.error('No redirect URL provided');
                return;
              }
              console.log('Redirecting to:', redirectUrl);
              window.location.href = redirectUrl;
            }}
          />
        </div>
      </div>
    </div>
  );
}
