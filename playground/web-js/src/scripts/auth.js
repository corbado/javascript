import Corbado from '@corbado/web-js';
import { CORBADO_PROJECT_ID, CORBADO_FRONTEND_API_URL_SUFFIX } from './environment';

await Corbado.load({
  projectId: CORBADO_PROJECT_ID,
  frontendApiUrlSuffix: CORBADO_FRONTEND_API_URL_SUFFIX,
  darkMode: 'auto',
  setShortSessionCookie: true,
});

const authElement = document.getElementById('corbado-auth');

Corbado.mountAuthUI(authElement, {
  onLoggedIn: () => {
    window.location.href = '/';
  },
});
