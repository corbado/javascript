'use client';

import { useRouter } from 'next/navigation';
import { createAccount } from '@/app/signup/actions';

export default function Page() {
  const router = useRouter();

  return (
    <>
      <div className='w-full flex justify-center'>
        <div className='w-96 my-4 mx-4'>
          <div className='mb-2 flex flex-col justify-between'>
            <div className='font-bold text-xl'>Home</div>
            <div>
              <p>Great, you are logged in.</p>
              <button
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 my-4 rounded w-full'
                onClick={async () => {
                  router.push(`/login`);
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
