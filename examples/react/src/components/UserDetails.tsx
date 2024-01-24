import { useCorbadoSession, PasskeyList } from '@corbado/react';
import { WelcomeMessage } from './WelcomeMessage';

export const UserDetails = () => {
  const { isAuthenticated } = useCorbadoSession();
  return isAuthenticated ? (
    <main className='flex-grow p-4'>
      <WelcomeMessage />
      <PasskeyList />
    </main>
  ) : null;
};
