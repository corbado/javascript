export const authGuideHeader = `Easiest Passkey Based Authentication with Corbado`;
export const passkeyGuideHeader = 'How about we check your list of Passkeys?';
export const authComponentBody = (
  <>
    Adding SignUp/Login screens is simple with <code className='language-bash'>@corbado/react</code>. The{' '}
    <code className='language-tsx'>{`<CorbadoAuth />`}</code> component allows your users to signUp and login with their
    passkeys. Additionally, it provides fallback options like email one-time passcode for users who don't have a passkey
    yet.
  </>
);
export const passkeyComponentBody = (
  <>
    You can make this possible by using the <code className='language-tsx'>{`<PasskeyList />`}</code> component. It
    shows all passkeys of the currently logged in user and allows them to add and remove passkeys.
  </>
);
export const installCommand = `npm install @corbado/react`;
export const providerSnippet = `import { CorbadoProvider } from '@corbado/react';
                
function App() {
  return (
    <CorbadoProvider projectId='pro-XXXXXXXXXXXXXXXXXXXX'>
      {/* Your routes and other components go here */}
      <AuthPage />
    </CorbadoProvider>
  );
}

export default App;`;
export const authSnippet = `import { CorbadoAuth } from '@corbado/react';

const AuthPage = () => {
  const onLoggedIn = () => {
    // Navigate or perform actions after successful login
  };

  return <CorbadoAuth onLoggedIn={onLoggedIn} />;
};

export default AuthPage;`;
export const passkeyListSnippet = `import { PasskeyList } from '@corbado/react';

const PasskeyListPage = () => {
  return <PasskeyList />;
};

export default PasskeyListPage;`;
