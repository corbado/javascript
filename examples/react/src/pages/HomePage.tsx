import { CorbadoAuth, PasskeyList, useCorbado } from '@corbado/react';
import Prism from 'prismjs';

import { useEffect } from 'react';
import { WelcomeMessage } from '../components/WelcomeMessage';
import { Guide } from '../components/Guide';

const HomePage = () => {
  const { isAuthenticated, loading } = useCorbado();

  useEffect(() => {
    Prism.highlightAll();
  }, [loading]);

  return (
    <div className='flex'>
      <div className='w-3/5 p-10 bg-gray-200'>
        <WelcomeMessage />
        <Guide />
      </div>
      <div className='w-2/5 p-5 flex items-center justify-center bg-dark-300'>
        {/* Right side content will go here */}
        {isAuthenticated ? <PasskeyList /> : <CorbadoAuth onLoggedIn={() => void 0} />}
      </div>
    </div>
  );
};

export default HomePage;
