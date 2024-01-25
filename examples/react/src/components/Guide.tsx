import { useCorbado } from '@corbado/react';
import {
  authComponentBody,
  authGuideHeader,
  authSnippet,
  installCommand,
  passkeyComponentBody,
  passkeyGuideHeader,
  passkeyListSnippet,
  providerSnippet,
} from '../utils/constants';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/themes/prism-tomorrow.min.css';

export const Guide = () => {
  const { isAuthenticated, loading } = useCorbado();

  if (loading) {
    return null;
  }

  return (
    <>
      <h2 className='heading mt-7'>{isAuthenticated ? passkeyGuideHeader : authGuideHeader}</h2>
      <p className='paragraph mb-3'>{isAuthenticated ? passkeyComponentBody : authComponentBody}</p>
      <ol>
        <li className='paragraph'>
          <h6 className='subheading'>1. Install the package</h6>
          <pre className='language-bash'>
            <code
              className='language-bash'
              data-prismjs-copy='Copy the JavaScript snippet!'
            >
              {installCommand}
            </code>
          </pre>
        </li>
        <li className='paragraph'>
          <h6 className='subheading'>2. Wrap your app with the CorbadoProvider</h6>
          <pre className='line-numbers language-tsx'>
            <code className='language-tsx'>{providerSnippet}</code>
          </pre>
        </li>
        {
          <li className='paragraph'>
            <h6 className='subheading'>
              3. Use <code className='language-tsx'>{isAuthenticated ? `<PasskeyList />` : `<CorbadoAuth />`}</code>
            </h6>
            <pre className='line-numbers language-tsx'>
              <code className='language-tsx'>{isAuthenticated ? passkeyListSnippet : authSnippet}</code>
            </pre>
          </li>
        }
      </ol>
    </>
  );
};
