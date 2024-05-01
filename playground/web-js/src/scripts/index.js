import Corbado from '@corbado/web-js';
import { CORBADO_PROJECT_ID } from './environment';

await Corbado.load({
  projectId: CORBADO_PROJECT_ID,
  darkMode: 'off',
});

if (!Corbado.user) {
  const corbadoAppElement = document.getElementById('corbado-app');
  corbadoAppElement.style.display = 'none';
  const corbadoAuthElement = document.getElementById('login');
  corbadoAuthElement.onclick = () => {
    window.location.href = '/auth.html';
  };
} else {
  const fallbackUI = document.getElementById('fallback-ui');
  fallbackUI.style.display = 'none';

  const header = document.getElementById('header');
  header.innerHTML = `Hi ${Corbado.user?.orig}, you are logged in.`;

  const shortSession = document.getElementById('short-session');
  shortSession.style.maxWidth = '550px';
  Corbado.mountUserUI(shortSession);

  const logoutButton = document.getElementById('logout');
  logoutButton.addEventListener('click', async () => {
    await Corbado.logout();
    window.location.href = '/auth.html#login-init';
  });

  const passkeyList = document.getElementById('passkey-list');
  passkeyList.style.maxWidth = '550px';
  Corbado.mountPasskeyListUI(passkeyList);
}
