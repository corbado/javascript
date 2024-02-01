export const authGuideHeader = `Setup Passkey-based Authentication in 3 Steps`;
export const passkeyGuideHeader = 'How about we check your list of Passkeys?';
export const authComponentBody = `
    Adding SignUp/Login screens is simple with <code class='language-bash'>@corbado/web-js</code>. The
    <code class='language-typescript'>Corbado.mountAuthUI()</code> function allows your users to signUp and login with their
    passkeys. Additionally, it provides fallback options like email one-time passcode for users who don't have a passkey
    yet.
`;
export const passkeyComponentBody = `
    You can make this possible by using the <code class='language-typescript'>Corbado.mountPasskeyListUI()</code> function. It
    shows all passkeys of the currently logged in user and allows them to add and remove passkeys.
`;
export const authSnippet = `const authElement = document.getElementById('corbado-auth');

// In your JavaScript or TypeScript file after initializing Corbado
Corbado.mountAuthUI(authElement, {
  onLoggedIn: () => {
    window.location.href = '/';
  },
});`;
export const passkeyListSnippet = `const passkeyListElement = document.getElementById('passkey-list');

// In your JavaScript or TypeScript file after initializing Corbado
if (Corbado.user) {
  Corbado.mountPasskeyListUI(passkeyListElement);
}`;
