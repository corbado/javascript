import Corbado from '@corbado/web-js';
import { jwtDecode } from 'jwt-decode';

Corbado.load({
  projectId: 'pro-503401103218055321',
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

  const decodedShortSession = jwtDecode(Corbado.shortSession);
  const serializedDecodedShortSession = JSON.stringify(decodedShortSession, null, 2);
  const shortSession = document.getElementById('short-session');
  shortSession.innerHTML = `<pre>${serializedDecodedShortSession}</pre>`;

  const logoutButton = document.getElementById('logout');
  logoutButton.addEventListener('click', () => {
    Corbado.logout();
    window.location.href = '/auth.html';
  });

  const passkeyList = document.getElementById('passkey-list');
  Corbado.mountPasskeyListUI(passkeyList);
}
