'use client';
export const runtime = 'edge';

import { CorbadoConnectAppend, CorbadoConnectPasskeyList } from '@corbado/connect-react';
import { useRouter } from 'next/navigation';

export default function PasskeyListPage() {
  const router = useRouter();

  return (
    <div className='w-full flex justify-center'>
      <div className='w-full my-4 mx-4'>
        <div className='mb-2 flex justify-between w-full'>
          <CorbadoConnectPasskeyList appendTokenProvider={function (): Promise<string> {
            throw new Error('Function not implemented.');
          } }/>
        </div>
      </div>
    </div>
  );
}
