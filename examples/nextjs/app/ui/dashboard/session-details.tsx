import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';

export default function SessionDetails() {
  const cookieStore = cookies();
  const session = cookieStore.get('cbo_short_session');

  const decodedShortSession = jwtDecode(session?.value ?? '');
  const serializedDecodedShortSession = JSON.stringify(decodedShortSession, null, 2);

  return (
    <>
      <div className='mb-3 mt-3'>
        <p>This is your shortSession:</p>
        <pre>{serializedDecodedShortSession}</pre>
      </div>
    </>
  );
}
