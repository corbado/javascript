import {
  authComponentBody,
  authGuideHeader,
  authSnippet,
  passkeyComponentBody,
  passkeyGuideHeader,
  passkeyListSnippet,
} from '../utils/constants.js';

const guideHtml = `
 <p class='paragraph'>
          The <code class='language-bash'>@corbado/web-js</code> package provides a comprehensive solution for
          integrating passkey-based authentication in any web application. It simplifies the process of managing
          authentication states and user sessions with easy-to-use hooks and UI components.
        </p>
    <h2 id="guide-header" class='heading mt-7'></h2>
    <p id="guide-body" class='paragraph mb-3'></p>
    <ol>
        <li class='paragraph'>
        <h6 class='subheading'>1. Install the package</h6>
        <pre class='language-bash'><code class='language-bash'>npm install @corbado/web-js</code></pre>
      </li>
      <li class='paragraph'>
        <h6 class='subheading'>2. Load Corbado Application</h6>
        <pre class='language-typescript'><code class='language-typescript'>import Corbado from '@corbado/web-js';
await Corbado.load({
projectId: 'pro-XXXXXXXXXXXXXXXXXXXX',
});</code></pre>
      </li>
      <li class='paragraph'>
      <h6 class='subheading'>
        3. Use <code id="auth-code-header" class='language-typescript'></code>
      </h6>
      <pre class='language-typescript'><code id="auth-code" class='language-typescript'></code></pre>
    </li>
    </ol>
`;

export function insertGuide(isAuthenticated) {
  const guideElement = document.getElementById('guide');
  if (guideElement) guideElement.innerHTML = guideHtml;

  const guideHeader = document.getElementById('guide-header');
  const guideBody = document.getElementById('guide-body');
  const authCodeHeader = document.getElementById('auth-code-header');
  const authCode = document.getElementById('auth-code');

  if (isAuthenticated) {
    if (guideHeader) guideHeader.innerHTML = passkeyGuideHeader;
    if (guideBody) guideBody.innerHTML = passkeyComponentBody;
    if (authCodeHeader) authCodeHeader.innerHTML = 'Corbado.mountPasskeyListUI()';
    if (authCode) authCode.innerHTML = passkeyListSnippet;
  } else {
    if (guideHeader) guideHeader.innerHTML = authGuideHeader;
    if (guideBody) guideBody.innerHTML = authComponentBody;
    if (authCodeHeader) authCodeHeader.innerHTML = 'Corbado.mountAuthUI()';
    if (authCode) authCode.innerHTML = authSnippet;
  }
}
