'use client';

import { CorbadoConnectAppend } from '@corbado/connect-react';
import { getAppendToken } from '@/app/signup/actions';
import { router } from 'next/client';
import { useRouter } from 'next/navigation';

export default function PostLoginPage() {
  const router = useRouter();

  return (
    <div className='w-full flex justify-center'>
      <div className='w-96 my-4 mx-4'>
        <div className='mb-2 flex justify-between'>
          <CorbadoConnectAppend
            projectId='pro-2'
            onLoaded={(msg: string) => console.log('component has loaded: ' + msg)}
            onSkip={() => router.push('/home')}
            appendTokenProvider={async () => {
              const t = await getAppendToken();
              console.log(t);

              return t;
            }}
            isDebug={true}
            onComplete={(method: string) => router.push('/home')}
            frontendApiUrlSuffix='frontendapi.corbado-dev.io'
          />
        </div>
      </div>
    </div>
  );
}
