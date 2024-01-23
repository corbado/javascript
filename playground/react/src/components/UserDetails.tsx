import { useCorbadoSession } from '@corbado/react-sdk';
import { jwtDecode } from 'jwt-decode';

export const UserDetails = () => {
  const { user, shortSession } = useCorbadoSession();

  const decodedShortSession = jwtDecode(shortSession ?? '');
  const serializedDecodedShortSession = JSON.stringify(decodedShortSession, null, 2);

  return (
    <>
      <p>Hi {user?.orig}, you are logged in.</p>
      <div className='mt-3 mb-3'>
        <p>This is your shortSession:</p>
        <pre style={{ textWrap: 'pretty' }}>{serializedDecodedShortSession}</pre>
      </div>
    </>
  );
};
