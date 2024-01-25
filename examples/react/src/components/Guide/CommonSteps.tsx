import { installCommand, providerSnippet } from '../../utils/constants';

export const CommonSteps = () => {
  return (
    <>
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
    </>
  );
};
