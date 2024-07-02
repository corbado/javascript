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
            onLoaded={(msg: string) => console.log('component has loaded: ' + msg)}
            onSkip={() => router.push('/home')}
            appendTokenProvider={async () => {
              const t = await getAppendToken();
              console.log(t);

              return t;
            }}
            onComplete={(method: string) => router.push('/home')}
          />
        </div>
      </div>
    </div>
  );
}
