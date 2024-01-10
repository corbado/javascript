import Corbado from '@corbado/web-js';
import englishTranslations from '../translations/en';

Corbado.load({
  projectId: import.meta.env.VITE_CORBADO_PROJECT_ID,
  darkMode: 'off',
  customTranslations: {
    en: englishTranslations,
  },
  theme:'eloquent-corbado-test'
});

const authElement = document.getElementById('corbado-auth');

Corbado.mountAuthUI(authElement!, {
  onLoggedIn: () => {
    window.location.href = '/';
  },
  isDevMode: true,
});
