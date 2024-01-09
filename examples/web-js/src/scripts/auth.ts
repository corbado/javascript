import Corbado from '@corbado/web-js';

Corbado.load({
  projectId: import.meta.env.VITE_CORBADO_PROJECT_ID,
  darkMode: 'off',
});

const authElement = document.getElementById('corbado-auth');

Corbado.mountAuthUI(authElement!, {
  onLoggedIn: () => {
    window.location.href = '/';
  },
});
