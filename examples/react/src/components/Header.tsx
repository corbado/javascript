import { useCorbadoSession } from '@corbado/react';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { faBook } from '@fortawesome/free-solid-svg-icons/faBook';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'prismjs/themes/prism-tomorrow.min.css';
import { useState } from 'react';

export const Header = () => {
  const { user, isAuthenticated } = useCorbadoSession();
  const [bounceGihub, setBounceGithub] = useState(false);
  const [bounceDocumentation, setBounceDocumentation] = useState(false);

  const onMouseIn = (setBounce: (value: boolean) => void) => {
    setBounce(true);
  };

  const onMouseOut = (setBounce: (value: boolean) => void) => {
    setBounce(false);
  };

  return (
    <header className='bg-amber-700 text-white p-2 flex justify-between items-center'>
      <h1 className='text-2xl md:text-4xl'>
        {' '}
        {isAuthenticated ? (
          `Hi ${user?.name ?? user?.orig} 👋`
        ) : (
          <>
            Welcome to <code className='language-ts'>@corbado/react</code> 👋
          </>
        )}
      </h1>
      <p className='flex justify-between gap-4 font-bold mr-5 text-2xl'>
        <a
          className='px-3'
          target='_blank'
          href='https://github.com/corbado/javascript/tree/main/packages/react'
          onPointerEnter={() => onMouseIn(setBounceGithub)}
          onPointerOut={() => onMouseOut(setBounceGithub)}
        >
          <FontAwesomeIcon
            icon={faGithub}
            bounce={bounceGihub}
          />{' '}
          Github
        </a>
        <a
          className='px-3'
          target='_blank'
          href='https://docs.corbado.com/frontend-integration/react?pk_vid=39aa19b26331c63f17061661133d1eca'
          onPointerEnter={() => onMouseIn(setBounceDocumentation)}
          onPointerOut={() => onMouseOut(setBounceDocumentation)}
        >
          {' '}
          <FontAwesomeIcon
            icon={faBook}
            bounce={bounceDocumentation}
          />{' '}
          Documentation
        </a>
      </p>
    </header>
  );
};
