'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'aws-amplify/auth';

type Props = {
  maybeSecretCode?: string;
};

export default function Home({ maybeSecretCode }: Props) {
  const router = useRouter();

  const logout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <>
      <div className='w-full flex justify-center'>
        <div className='my-4 mx-4'>
          <div className='mb-2 flex flex-col justify-between'>
            <div className='font-bold text-xl'>Home</div>
            <div>
              <p>Great, you are logged in.</p>
              <button
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 my-4 rounded w-full'
                onClick={() => {
                  router.push(`/passkey-list`);
                }}
              >
                Passkey List
              </button>
              <button
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 my-4 rounded w-full'
                onClick={logout}
              >
                Logout
              </button>

              {maybeSecretCode ? (
                <div className='bg-green-200 border border-green-600 text-green-600 p-2'>{maybeSecretCode}</div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
