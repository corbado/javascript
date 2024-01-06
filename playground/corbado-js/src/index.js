import Corbado from '@corbado/corbado-js';

const app = document.getElementById('app');
Corbado.load({
  projectId: 'pro-503401103218055321',
});
Corbado.mountAuthUI(app, {
  onLoggedIn: () => {
    console.log('Logged in!');
  },
});
