'use client';

import { CorbadoConnectAppend } from '@corbado/connect-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCorbadoToken, postPasskeyAppend } from '@/app/(auth-required)/post-login/actions';
import { fetchAuthSession } from 'aws-amplify/auth';
import { AppendStatus } from '@corbado/types';

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className='flex h-screen w-screen items-center justify-center bg-gray-50'>
      <div className='z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-gray-100 shadow-xl'>
        <div className='flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-8'>
          <CorbadoConnectAppend
            onSkip={async () => {
              const postSignup = searchParams.get('post-signup');
              if (postSignup) {
                router.push('/setup-mfa?post-signup=true');
              } else {
                router.push('/profile');
              }
            }}
            appendTokenProvider={async () => {
              const session = await fetchAuthSession();
              const idToken = session.tokens?.idToken?.toString();

              return await getCorbadoToken(idToken);
            }}
            onComplete={async (appendStatus: AppendStatus, clientState: string) => {
              await postPasskeyAppend(appendStatus, clientState);
              router.push('/profile');
            }}
          />
        </div>
      </div>
    </div>
  );
}
