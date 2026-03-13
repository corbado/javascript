import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';

export default async function SessionDetails() {
  const cookieStore = await cookies();
  const sessionTokenCookie = cookieStore.get('cbo_session_token');

  const decodedSessionToken = jwtDecode(sessionTokenCookie?.value ?? '');
  const serializedDecodedSessionToken = JSON.stringify(decodedSessionToken, null, 2);

  return (
    <>
      <div className='mb-3 mt-3'>
        <p>This is your sessionToken:</p>
        <pre>{serializedDecodedSessionToken}</pre>
      </div>
    </>
  );
}
