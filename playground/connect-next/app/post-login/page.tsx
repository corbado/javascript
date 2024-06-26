'use client';
export const runtime = 'edge';

import { CorbadoConnectAppend } from '@corbado/connect-react';
import { useRouter } from 'next/navigation';
import { getAppendToken } from './actions';

export default function PostLoginPage() {
  const router = useRouter();

  return (
    <div className='w-full flex justify-center'>
      <div className='w-96 my-4 mx-4'>
        <div className='mb-2 flex justify-between'>
          <CorbadoConnectAppend
            projectId={process.env.NEXT_PUBLIC_CORBADO_PROJECT_ID!}
            onLoaded={(msg: string) => console.log('component has loaded: ' + msg)}
            onSkip={() => router.push('/home')}
            appendTokenProvider={async () => {
              const t = await getAppendToken();
              console.log(t);

              return t;
            }}
            isDebug={true}
            onComplete={(method: string) => router.push('/home')}
            frontendApiUrlSuffix={process.env.NEXT_PUBLIC_CORBADO_FRONTEND_API_URL_SUFFIX}
          />
        </div>
      </div>
    </div>
  );
}
