import Corbado from '@corbado/web-js';

Corbado.load({
  projectId: 'pro-503401103218055321',
  darkMode: 'off',
});

const authElement = document.getElementById('corbado-auth');

Corbado.mountAuthUI(authElement, {
  onLoggedIn: () => {
    window.location.href = '/';
  },
});
