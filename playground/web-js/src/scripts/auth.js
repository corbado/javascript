import Corbado from '@corbado/web-js';
import { CORBADO_PROJECT_ID } from './environment';

await Corbado.load({
  projectId: CORBADO_PROJECT_ID,
  darkMode: 'off',
});

const authElement = document.getElementById('corbado-auth');

Corbado.mountAuthUI(authElement, {
  onLoggedIn: () => {
    window.location.href = '/';
  },
});
