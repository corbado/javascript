import { useCorbadoSession } from '@corbado/react';
import 'prismjs/themes/prism-tomorrow.min.css';

export const WelcomeMessage = () => {
  const { user, isAuthenticated, loading } = useCorbadoSession();

  if (loading) {
    return null;
  }

  return (
    <>
      <h1 className='heading'>
        {isAuthenticated ? (
          `Hi ${user?.name ?? user?.orig} 👋`
        ) : (
          <>
            Welcome to <code className='language-ts'>@corbado/react</code>
          </>
        )}
      </h1>
      <p className='paragraph'>
        The <code className='language-bash'>@corbado/react</code> package provides a comprehensive solution for
        integrating passkey-based authentication in React applications. It simplifies the process of managing
        authentication states and user sessions with easy-to-use hooks and UI components.
      </p>
    </>
  );
};
