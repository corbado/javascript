'use client';

import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  return (
    <>
      <p>You are logged in.</p>
      <div className='component'>
        <div className='sub-container'>
          <button
            onClick={async () => {
              router.push(`/login`);
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
