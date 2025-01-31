import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';

export default function SessionDetails() {
  const cookieStore = cookies();
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
