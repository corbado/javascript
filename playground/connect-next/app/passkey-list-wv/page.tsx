'use client';
import { useEffect, useState } from 'react';

export const runtime = 'edge';

import { CorbadoConnectPasskeyList } from '@corbado/connect-react';
import { getCorbadoToken } from './actions';
import { getAppendToken } from '../actions';
import { useSearchParams } from 'next/navigation';

export default function PasskeyListPage() {
  const searchParams = useSearchParams();
  const identifier = searchParams.get('identifier');
  const email = searchParams.get('email');
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
      <div className='w-full my-4 mx-4'>
        <div className='mb-2 flex justify-between w-full'>
          <CorbadoConnectPasskeyList
            connectTokenProvider={async tokenType =>
              tokenType === 'passkey-append' ? await getAppendToken() : await getCorbadoToken(tokenType)
            }
          />
        </div>
      </div>
    </div>
  );
}
