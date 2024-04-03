import { cookies } from 'next/headers';
import { Providers } from '../providers';
import validateSession from '../utils/validateSession';
import AuthForm from './auth-form';
import Image from 'next/image';

export default async function RightIntroSection() {
  //TODO: Uncomment the following lines to enable session validation after Node SDK has added support for frontend API v2
  // const cookieStore = cookies();
  // const sessionCookie = cookieStore.get('cbo_short_session');
  // const shortSession = sessionCookie?.value;
  // const isSessionValid = await validateSession(shortSession);

  // if (isSessionValid) {
  //   return (
  //     <Image
  //       src='/flow-diagram.png'
  //       width={1000}
  //       height={760}
  //       className='md:block'
  //       alt='Corbado Flow Diagram'
  //     />
  //   );
  // }

  return (
    <Providers>
      <AuthForm />
    </Providers>
  );
}
