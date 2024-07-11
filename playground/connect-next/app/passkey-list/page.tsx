'use client';
export const runtime = 'edge';

import { CorbadoConnectPasskeyList } from '@corbado/connect-react';
import { useRouter } from 'next/navigation';
import { getCorbadoToken } from './actions';
import { getAppendToken } from '../actions';

export default function PasskeyListPage() {
  const router = useRouter();

  return (
    <div className='w-full flex justify-center'>
      <div className='w-full my-4 mx-4'>
        <div className='mb-2 flex justify-between w-full'>
          <CorbadoConnectPasskeyList
            corbadoTokenProvider={async token => {
              const t = token === 'passkey-append' ? await getAppendToken() : await getCorbadoToken(token);
              console.log(t);

              return t;
            }}
          />
        </div>
      </div>
    </div>
  );
}
