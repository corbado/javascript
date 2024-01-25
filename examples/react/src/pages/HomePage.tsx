import { useCorbado } from '@corbado/react';
import Prism from 'prismjs';
import '../assets/corbado-custom-theme.css';

import { useEffect } from 'react';
import { WelcomeMessage } from '../components/WelcomeMessage';
import { Guide } from '../components/Guide';
import { Header } from '../components/Header';
import { Demo } from '../components/Demo';

const HomePage = () => {
  const { loading } = useCorbado();

  useEffect(() => {
    Prism.highlightAll();
  }, [loading]);

  return (
    <>
      <Header />
      <div className='flex'>
        <div className='w-2/3 p-10 bg-gray-200'>
          <WelcomeMessage />
          <Guide />
        </div>
        <div className='w-1/3 mt-8 flex items-start justify-around'>
          <Demo />
        </div>
      </div>
    </>
  );
};

export default HomePage;
