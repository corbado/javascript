'use client';
import { CorbadoConnectAppend } from '@corbado/connect-react';
import { getCorbadoToken, postPasskeyAppend } from '@/app/(auth-required)/post-login-wv/actions';
import { AppendStatus } from '@corbado/types';

export default function PostLoginPage() {
  return (
    <div className='w-full flex justify-center'>
      <div className='w-96 my-4 mx-4'>
        <div className='mb-2 flex justify-between'>
          <CorbadoConnectAppend
            onSkip={async status => {
              window.location.href = `auth://callback?status=${status}`;
            }}
            appendTokenProvider={async () => {
              return await getCorbadoToken();
            }}
            onComplete={async (status: AppendStatus, clientSideState: string) => {
              await postPasskeyAppend(status, clientSideState);
              window.location.href = `auth://callback?status=${status}`;
            }}
          />
        </div>
      </div>
    </div>
  );
}
