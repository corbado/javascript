import { cookies } from 'next/headers';
import { Providers } from '../providers';
import validateSession from '../utils/validateSession';
import AuthForm from './auth-form';
import Image from 'next/image';

export default async function RightIntroSection() {
  const cookieStore = await cookies();
  const sessionTokenCookie = cookieStore.get('cbo_session_token');
  const sessionToken = sessionTokenCookie?.value;
  const isSessionValid = await validateSession(sessionToken);

  if (isSessionValid) {
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

  return (
    <Providers>
      <AuthForm />
    </Providers>
  );
}
