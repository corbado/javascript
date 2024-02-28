import Corbado from '@corbado/web-js';
import { jwtDecode } from 'jwt-decode';
import { CORBADO_PROJECT_ID } from './environment';

await Corbado.load({
  projectId: CORBADO_PROJECT_ID,
  darkMode: 'off',
  isDevMode: true,
});

function loadAuthComponent() {
  const corbadoAppElement = document.getElementById('corbado-app');
  corbadoAppElement.style.display = 'none';

  const fallbackUI = document.getElementById('fallback-ui');
  fallbackUI.style.display = 'initial';

  const authUI = document.getElementById('auth-ui');
  Corbado.mountAuthUI(authUI, {
    onLoggedIn: () => {
      Corbado.unmountAuthUI(authUI);

      loadPasskeyListComponent();
    },
  });
}

function loadPasskeyListComponent() {
  const fallbackUI = document.getElementById('fallback-ui');
  fallbackUI.style.display = 'none';

  const corbadoAppElement = document.getElementById('corbado-app');
  corbadoAppElement.style.display = 'initial';

  const header = document.getElementById('header');
  header.innerHTML = `Hi ${Corbado.user?.orig}, you are logged in.`;

  const decodedShortSession = jwtDecode(Corbado.shortSession);
  const serializedDecodedShortSession = JSON.stringify(decodedShortSession, null, 2);
  const shortSession = document.getElementById('short-session');
  shortSession.innerHTML = `<pre>${serializedDecodedShortSession}</pre>`;

  const passkeyList = document.getElementById('passkey-list');
  Corbado.mountPasskeyListUI(passkeyList);

  const logoutButton = document.getElementById('logout');
  logoutButton.addEventListener('click', () => {
    Corbado.logout();
    Corbado.unmountPasskeyListUI(passkeyList);
    loadAuthComponent();
  });
}

if (Corbado.user) {
  loadPasskeyListComponent();
} else {
  loadAuthComponent();
}
