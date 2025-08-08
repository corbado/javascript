'use client';
import { CorbadoConnectPasskeyList } from '@corbado/connect-react';
import { getCorbadoToken } from './actions';

export default function PasskeyListPage() {
  return (
    <div className='w-full flex justify-center'>
      <div className='w-full my-4 mx-4'>
        <div className='mb-2 flex justify-between w-full'>
          <CorbadoConnectPasskeyList connectTokenProvider={async tokenType => getCorbadoToken(tokenType)} />
        </div>
      </div>
    </div>
  );
}
