'use client';

import { CorbadoAuth, useCorbado } from '@corbado/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AuthForm() {
  const { isAuthenticated } = useCorbado();
  const router = useRouter();

  //TODO" Remove the following lines after Node SDK has added support for frontend API v2
  if (isAuthenticated) {
    return (
      <Image
        src='/flow-diagram.png'
        width={1000}
        height={760}
        className='md:block'
        alt='Corbado Flow Diagram'
      />
    );
  }

  const onLoggedIn = async () => {
    router.push('/dashboard');
  };

  return <CorbadoAuth onLoggedIn={onLoggedIn} />;
}
