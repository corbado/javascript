import { useCorbado } from '@corbado/react';
import { passkeyListSnippet, authSnippet } from '../../utils/constants';

export const AuthBasedSteps = () => {
  const { isAuthenticated } = useCorbado();
  return (
    <li className='paragraph'>
      <h6 className='subheading'>
        3. Use <code className='language-tsx'>{isAuthenticated ? `<PasskeyList />` : `<CorbadoAuth />`}</code>
      </h6>
      <pre className='line-numbers language-tsx'>
        <code className='language-tsx'>{isAuthenticated ? passkeyListSnippet : authSnippet}</code>
      </pre>
    </li>
  );
};
